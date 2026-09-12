import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Send, CheckCircle2, Clock } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get('/applications/mine').then(({ data }) => setApps(data)).catch(() => {});
  }, []);

  const stats = {
    total: apps.length,
    shortlisted: apps.filter((a) => a.status === 'Shortlisted').length,
    hired: apps.filter((a) => a.status === 'Hired').length,
    pending: apps.filter((a) => a.status === 'Applied').length,
  };

  const cards = [
    { label: 'Total Applications', value: stats.total, icon: Send, color: 'text-primary-600 bg-primary-50' },
    { label: 'In Review', value: stats.pending, icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: CheckCircle2, color: 'text-yellow-700 bg-yellow-50' },
    { label: 'Hired', value: stats.hired, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <h2 className="text-lg font-semibold text-navy">Welcome, {user?.name}!</h2>
        <p className="text-sm text-slate-500 mt-1">
          {user?.resume ? 'Your resume is uploaded.' : 'Upload your resume to start applying.'}
        </p>
        <div className="mt-4 flex gap-2">
          <Link to="/jobs" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">
            Browse Jobs
          </Link>
          <Link to="/seeker/profile" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-sm inline-flex items-center gap-1">
            <FileText size={14} /> Profile
          </Link>
        </div>
      </div>

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
    </div>
  );
}