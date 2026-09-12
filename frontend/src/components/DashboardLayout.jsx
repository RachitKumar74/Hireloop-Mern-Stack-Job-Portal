import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Briefcase, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ title, links }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-4">
            <div className="flex items-center gap-2 font-bold text-navy mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary-600 text-white grid place-items-center">
                <Briefcase size={16} />
              </span>
              HireLoop
            </div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">{title}</p>
            <nav className="space-y-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-4 w-full inline-flex items-center justify-center gap-1 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </aside>
        <section className="flex-1">
          <h1 className="text-2xl font-bold text-navy mb-4">{title}</h1>
          <Outlet />
        </section>
      </div>
    </div>
  );
}