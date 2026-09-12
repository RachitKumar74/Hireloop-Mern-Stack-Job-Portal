import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'employer') navigate('/employer');
      else navigate('/seeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-navy">Create account</h1>
        <p className="text-sm text-slate-500 mt-1">Join HireLoop as a job seeker or employer</p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-navy">Full Name</label>
            <input
              name="name" required
              value={form.name} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
            />
          </div>
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
              name="password" type="password" required minLength={6}
              value={form.password} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">I am a</label>
            <select
              name="role"
              value={form.role} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500 text-center">
          Already have an account? <Link to="/login" className="text-primary-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}