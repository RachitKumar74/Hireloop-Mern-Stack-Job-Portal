import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const statusStyles = {
  approved: 'bg-green-50 text-green-600',
  pending: 'bg-yellow-50 text-yellow-700',
  rejected: 'bg-red-50 text-red-600',
};

const TABS = ['all', 'pending', 'approved', 'rejected'];

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  const load = async (status) => {
    setLoading(true);
    try {
      const qs = status && status !== 'all' ? `?status=${status}` : '';
      const { data } = await api.get(`/admin/jobs${qs}`);
      setJobs(data);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(tab); }, [tab]);

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/admin/jobs/${id}/status`, { status });
      toast.success(`Job ${status}`);
      load(tab);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this job and its applications?')) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success('Job deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize transition ${
              tab === t
                ? 'bg-primary-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-soft text-center">
          <p className="text-slate-500">No jobs in this category.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Job</th>
                  <th className="text-left px-5 py-3">Employer</th>
                  <th className="text-left px-5 py-3">Location</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-navy">{j.title}</p>
                      <p className="text-xs text-slate-500">{j.company}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {j.postedBy?.name || '—'}
                      <p className="text-xs text-slate-400">{j.postedBy?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{j.location}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[j.status]}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        {j.status !== 'approved' && (
                          <button
                            onClick={() => changeStatus(j._id, 'approved')}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600"
                          >
                            <CheckCircle2 size={12} /> Approve
                          </button>
                        )}
                        {j.status !== 'rejected' && (
                          <button
                            onClick={() => changeStatus(j._id, 'rejected')}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(j._id)}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}