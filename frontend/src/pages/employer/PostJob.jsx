import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const empty = {
  title: '', company: '', description: '', requirements: '',
  skills: '', location: '', salary: '', jobType: 'Full-time', experience: '',
};

export default function PostJob() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', form);
      toast.success('Job posted! Awaiting admin approval.');
      navigate('/employer/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      <input
        name={name} type={type} value={form[name]} onChange={onChange} placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-soft">
      <h2 className="text-lg font-semibold text-navy">Post a New Job</h2>
      <p className="text-sm text-slate-500 mt-1">Job will be visible after admin approval.</p>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        {field('title', 'Job Title', 'text', 'Frontend Developer')}
        {field('company', 'Company', 'text', 'TechNova')}
        {field('location', 'Location', 'text', 'Bangalore / Remote')}
        {field('salary', 'Salary', 'text', '6-10 LPA')}
        {field('experience', 'Experience', 'text', '1-3 years')}

        <div>
          <label className="text-sm font-medium text-navy">Job Type</label>
          <select
            name="jobType" value={form.jobType} onChange={onChange}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
          </select>
        </div>

        {field('skills', 'Skills (comma-separated)', 'text', 'React, Node, MongoDB')}

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-navy">Description</label>
          <textarea
            name="description" rows="4" value={form.description} onChange={onChange}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-navy">Requirements</label>
          <textarea
            name="requirements" rows="3" value={form.requirements} onChange={onChange}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
}