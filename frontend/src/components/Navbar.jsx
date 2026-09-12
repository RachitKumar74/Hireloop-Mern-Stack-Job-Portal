import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600'
  }`;

const dashboardPath = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'employer') return '/employer';
  return '/seeker';
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-navy">
          <span className="w-9 h-9 rounded-xl bg-primary-600 text-white grid place-items-center">
            <Briefcase size={18} />
          </span>
          HireLoop
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/jobs" className={linkClass}>Jobs</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <Link
              to={dashboardPath(user.role)}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <span className="text-sm text-slate-500 hidden md:inline">
              Hi, {user.name.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 px-4 py-2 rounded-lg"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}