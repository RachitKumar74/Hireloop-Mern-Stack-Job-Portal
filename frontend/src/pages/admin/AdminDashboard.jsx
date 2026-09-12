import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Briefcase, FileText, Clock,
  CheckCircle2, XCircle, UserCheck, Building2,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, j] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/jobs?status=pending'),
        ]);
        setStats(s.data);
        setPending(j.data.slice(0, 5));
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-primary-600 bg-primary-50' },
    { label: 'Job Seekers', value: stats?.seekerCount, icon: UserCheck, color: 'text-blue-600 bg-blue-50' },
    { label: 'Employers', value: stats?.employerCount, icon: Building2, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Total Jobs', value: stats?.totalJobs, icon: Briefcase, color: 'text-navy bg-slate-100' },
    { label: 'Applications', value: stats?.totalApplications, icon: FileText, color: 'text-purple-600 bg-purple-50' },
    { label: 'Pending Jobs', value: stats?.pendingJobs, icon: Clock, color: 'text-yellow-700 bg-yellow-50' },
    { label: 'Approved Jobs', value: stats?.approvedJobs, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { label: 'Rejected Jobs', value: stats?.rejectedJobs, icon: XCircle, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${color}`}>
              <Icon size={18} />
            </div>
            <p className="mt-3 text-2xl font-bold text-navy">{value ?? 0}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-navy">Pending Jobs</h3>
          <Link to="/admin/jobs" className="text-xs text-primary-600 font-semibold hover:underline">
            View all →
          </Link>
        </div>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">No pending jobs. All clear! ✅</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pending.map((j) => (
              <li key={j._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-navy">{j.title}</p>
                  <p className="text-xs text-slate-500">{j.company} • {j.location}</p>
                </div>
                <Link
                  to="/admin/jobs"
                  className="text-xs font-semibold text-primary-600 hover:underline"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}