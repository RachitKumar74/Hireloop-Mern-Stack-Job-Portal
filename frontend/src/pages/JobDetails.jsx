import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.role === 'jobseeker') {
      api.get('/applications/mine')
        .then(({ data }) => {
          if (data.some((a) => a.job?._id === id)) setAlreadyApplied(true);
        })
        .catch(() => {});
    }
  }, [user, id]);

  const onApplyClick = () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (user.role !== 'jobseeker') {
      toast.error('Only job seekers can apply');
      return;
    }
    if (!user.resume) {
      toast.error('Please upload your resume first');
      navigate('/seeker/profile');
      return;
    }
    setShowApply(true);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      await api.post('/applications', { jobId: id, coverLetter });
      toast.success('Application submitted!');
      setShowApply(false);
      setAlreadyApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader />;
  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">{error || 'Job not found.'}</p>
        <Link to="/jobs" className="mt-4 inline-block text-primary-600 font-semibold">← Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/jobs" className="text-sm text-slate-500 hover:text-primary-600 inline-flex items-center gap-1">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <div className="mt-4 bg-white rounded-2xl shadow-soft border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy">{job.title}</h1>
            <p className="text-slate-500 mt-1">{job.company}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
              <span className="inline-flex items-center gap-1"><Briefcase size={14} /> {job.jobType}</span>
              <span className="inline-flex items-center gap-1"><IndianRupee size={14} /> {job.salary}</span>
              <span className="inline-flex items-center gap-1"><Clock size={14} /> {job.experience}</span>
            </div>
          </div>

          {user?.role === 'jobseeker' ? (
            alreadyApplied ? (
              <span className="bg-green-50 text-green-600 font-semibold px-5 py-2.5 rounded-xl">✓ Applied</span>
            ) : (
              <button onClick={onApplyClick} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition">
                Apply Now
              </button>
            )
          ) : !user ? (
            <button onClick={onApplyClick} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition">
              Apply Now
            </button>
          ) : null}
        </div>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="font-semibold text-navy">Description</h2>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">{job.description}</p>
          </section>
          <section>
            <h2 className="font-semibold text-navy">Requirements</h2>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">{job.requirements}</p>
          </section>
          {job.skills?.length > 0 && (
            <section>
              <h2 className="font-semibold text-navy">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-primary-50 text-primary-600">{s}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {showApply && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-navy text-lg">Apply for {job.title}</h3>
              <button onClick={() => setShowApply(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-1">Your uploaded resume will be attached.</p>
            <div className="mt-4">
              <label className="text-sm font-medium text-navy">Cover Letter (optional)</label>
              <textarea
                rows="5" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Why are you a good fit?"
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-500"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowApply(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button onClick={submitApplication} disabled={applying}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl">
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}