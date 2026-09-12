import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Upload, FileText } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { fileUrl } from '../../utils/fileUrl';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', location: '', skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
      });
    }
  }, [user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const { data } = await api.put('/auth/me', payload);
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const { data } = await api.post('/auth/upload-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(data.user);
      toast.success('Resume uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <h3 className="font-semibold text-navy flex items-center gap-2">
          <FileText size={18} /> Resume
        </h3>
        {user?.resume ? (
          <div className="mt-3 flex items-center gap-3">
            <a
              href={fileUrl(user.resume)}
              target="_blank" rel="noreferrer"
              className="text-sm text-primary-600 underline"
            >
              View current resume
            </a>
          </div>
        ) : (
          <p className="text-sm text-slate-500 mt-2">No resume uploaded yet.</p>
        )}
        <label className="mt-4 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-xl text-sm cursor-pointer">
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload Resume (PDF/DOC)'}
          <input type="file" accept=".pdf,.doc,.docx" onChange={onFile} hidden disabled={uploading} />
        </label>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <h3 className="font-semibold text-navy">Profile Info</h3>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-navy">Full Name</label>
            <input name="name" value={form.name} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Phone</label>
            <input name="phone" value={form.phone} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Location</label>
            <input name="location" value={form.location} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Skills (comma-separated)</label>
            <input name="skills" value={form.skills} onChange={onChange}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-500" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}