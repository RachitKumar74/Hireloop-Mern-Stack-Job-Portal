import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FileText, Mail, MapPin, Phone, User } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { fileUrl } from '../../utils/fileUrl';

const STATUSES = ['Applied', 'Shortlisted', 'Rejected', 'Hired'];

const statusStyles = {
  Applied: 'bg-blue-50 text-blue-600',
  Shortlisted: 'bg-yellow-50 text-yellow-700',
  Rejected: 'bg-red-50 text-red-600',
  Hired: 'bg-green-50 text-green-600',
};

export default function Applicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [filter, setFilter] = useState('All');

  const load = async () => {
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApps(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get(`/jobs/${jobId}`)
      .then(({ data }) => setJobTitle(data.title))
      .catch(() => {});
    load();
  }, [jobId]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      setApps((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const filtered = filter === 'All'
    ? apps
    : apps.filter((a) => a.status === filter);

  if (loading) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          to="/employer/jobs"
          className="text-sm text-slate-500 hover:text-primary-600 inline-flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to My Jobs
        </Link>
        <p className="text-sm text-slate-500">
          {apps.length} applicant{apps.length !== 1 && 's'} for{' '}
          <span className="font-semibold text-navy">{jobTitle}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
              filter === s
                ? 'bg-primary-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
            }`}
          >
            {s}
            {s !== 'All' && (
              <span className="ml-1 opacity-70">
                ({apps.filter((a) => a.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-soft text-center">
          <p className="text-slate-500">
            {apps.length === 0
              ? 'No applications yet for this job.'
              : `No applications with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 grid place-items-center font-semibold">
                      {a.applicant?.name?.[0]?.toUpperCase() || <User size={16} />}
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{a.applicant?.name}</p>
                      <p className="text-xs text-slate-500">
                        Applied {new Date(a.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${statusStyles[a.status]}`}>
                      {a.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                    {a.applicant?.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail size={13} /> {a.applicant.email}
                      </span>
                    )}
                    {a.applicant?.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={13} /> {a.applicant.phone}
                      </span>
                    )}
                    {a.applicant?.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} /> {a.applicant.location}
                      </span>
                    )}
                  </div>

                  {a.applicant?.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {a.applicant.skills.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {a.coverLetter && (
                    <div className="mt-3 bg-slate-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-slate-500 mb-1">Cover Letter</p>
                      <p className="text-sm text-slate-700 whitespace-pre-line">{a.coverLetter}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:w-48">
                  {a.resume && (
                    <a
                      href={fileUrl(a.resume)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-xl"
                    >
                      <FileText size={14} /> View Resume
                    </a>
                  )}

                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a._id, e.target.value)}
                    className="text-sm px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}