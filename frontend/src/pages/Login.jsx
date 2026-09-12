import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'employer') navigate('/employer');
      else navigate('/seeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">Login to your HireLoop account</p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-navy">Email</label>
            <input
              name="email" type="email" required
              value={form.email} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Password</label>
            <input
              name="password" type="password" required
              value={form.password} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500 text-center">
          Don't have an account? <Link to="/register" className="text-primary-600 font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}