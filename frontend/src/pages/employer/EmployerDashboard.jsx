import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/employer/mine')
      .then(({ data }) => setJobs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data: myJobs } = await api.get('/jobs/employer/mine');
        const results = await Promise.all(
          myJobs.map((j) =>
            api.get(`/applications/job/${j._id}`)
              .then(({ data }) => data.map((a) => ({ ...a, job: { title: j.title, _id: j._id } })))
              .catch(() => [])
          )
        );
        const all = results.flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentApps(all);
      } catch {}
    };
    fetchRecent();
  }, []);

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    approved: jobs.filter((j) => j.status === 'approved').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
  };

  const cards = [
    { label: 'Total Jobs', value: stats.total, icon: Briefcase, color: 'text-primary-600 bg-primary-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-700 bg-yellow-50' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <h2 className="text-lg font-semibold text-navy">Welcome, {user?.name}!</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your job postings and find great candidates.
        </p>
        <Link
          to="/employer/post-job"
          className="mt-4 inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-xl text-sm"
        >
          + Post a New Job
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${color}`}>
                <Icon size={18} />
              </div>
              <p className="mt-3 text-2xl font-bold text-navy">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <h3 className="font-semibold text-navy mb-3">Recent Jobs</h3>
        {jobs.slice(0, 5).length === 0 ? (
          <p className="text-sm text-slate-500">No jobs posted yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {jobs.slice(0, 5).map((j) => (
              <li key={j._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-navy">{j.title}</p>
                  <p className="text-xs text-slate-500">{j.company} • {j.location}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  j.status === 'approved' ? 'bg-green-50 text-green-600'
                  : j.status === 'pending' ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-600'
                }`}>
                  {j.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <h3 className="font-semibold text-navy mb-3">Recent Applicants</h3>
        {recentApps.length === 0 ? (
          <p className="text-sm text-slate-500">No applications yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentApps.map((a) => (
              <li key={a._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-navy">{a.applicant?.name}</p>
                  <p className="text-xs text-slate-500">
                    applied for <span className="font-medium">{a.job?.title}</span>
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  a.status === 'Hired' ? 'bg-green-50 text-green-600'
                  : a.status === 'Shortlisted' ? 'bg-yellow-50 text-yellow-700'
                  : a.status === 'Rejected' ? 'bg-red-50 text-red-600'
                  : 'bg-blue-50 text-blue-600'
                }`}>
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}