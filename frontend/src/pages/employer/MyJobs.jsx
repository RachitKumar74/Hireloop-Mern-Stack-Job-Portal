import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Users } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const statusColor = {
  approved: 'bg-green-50 text-green-600',
  pending: 'bg-yellow-50 text-yellow-700',
  rejected: 'bg-red-50 text-red-600',
};

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});

  const load = async () => {
    try {
      const { data } = await api.get('/jobs/employer/mine');
      setJobs(data);
      const entries = await Promise.all(
        data.map(async (j) => {
          try {
            const r = await api.get(`/applications/job/${j._id}`);
            return [j._id, r.data.length];
          } catch {
            return [j._id, 0];
          }
        })
      );
      setCounts(Object.fromEntries(entries));
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      setJobs((j) => j.filter((x) => x._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader />;

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-soft text-center">
        <p className="text-slate-500">You haven't posted any jobs yet.</p>
        <Link
          to="/employer/post-job"
          className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold text-sm"
        >
          Post your first job
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-3"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-navy">{job.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[job.status] || 'bg-slate-100'}`}>
                {job.status}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              {job.company} • {job.location} • {job.jobType}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {counts[job._id] ?? 0} applicant{counts[job._id] === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/employer/applicants/${job._id}`}
              className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600"
            >
              <Users size={14} /> Applicants
            </Link>
            <Link
              to={`/employer/edit-job/${job._id}`}
              className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <Pencil size={14} /> Edit
            </Link>
            <button
              onClick={() => onDelete(job._id)}
              className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}