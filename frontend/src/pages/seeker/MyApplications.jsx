import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const statusStyles = {
  Applied: 'bg-blue-50 text-blue-600',
  Shortlisted: 'bg-yellow-50 text-yellow-700',
  Rejected: 'bg-red-50 text-red-600',
  Hired: 'bg-green-50 text-green-600',
};

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/mine')
      .then(({ data }) => setApps(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (apps.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-soft text-center">
        <p className="text-slate-500">You haven't applied to any jobs yet.</p>
        <Link to="/jobs" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold text-sm">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {apps.map((app) => (
        <div key={app._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-navy">{app.job?.title || 'Job removed'}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[app.status]}`}>
                {app.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 inline-flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><Briefcase size={13} /> {app.job?.company}</span>
              <span className="inline-flex items-center gap-1"><MapPin size={13} /> {app.job?.location}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Applied on {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
          {app.job && (
            <Link to={`/jobs/${app.job._id}`}
              className="text-sm text-primary-600 font-semibold hover:underline">
              View Job →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}