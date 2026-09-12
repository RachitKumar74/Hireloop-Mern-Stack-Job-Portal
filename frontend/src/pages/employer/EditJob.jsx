import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setForm({
        ...data,
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
      }))
      .catch(() => toast.error('Failed to load job'));
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/jobs/${id}`, form);
      toast.success('Job updated');
      navigate('/employer/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <Loader />;

  const field = (name, label) => (
    <div>
      <label className="text-sm font-medium text-navy">{label}</label>
      <input
        name={name} value={form[name] || ''} onChange={onChange}
        className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-soft">
      <h2 className="text-lg font-semibold text-navy">Edit Job</h2>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        {field('title', 'Job Title')}
        {field('company', 'Company')}
        {field('location', 'Location')}
        {field('salary', 'Salary')}
        {field('experience', 'Experience')}

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

        {field('skills', 'Skills (comma-separated)')}

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-navy">Description</label>
          <textarea
            name="description" rows="4" value={form.description || ''} onChange={onChange}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-navy">Requirements</label>
          <textarea
            name="requirements" rows="3" value={form.requirements || ''} onChange={onChange}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}