import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship'];

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = params.get('q') || '';
  const type = params.get('type') || 'All';
  const location = params.get('location') || '';

  useEffect(() => {
    setLoading(true);
    const fetchJobs = async () => {
      try {
        const qs = new URLSearchParams();
        if (query) qs.set('q', query);
        if (type && type !== 'All') qs.set('type', type);
        if (location) qs.set('location', location);
        const { data } = await api.get(`/jobs?${qs.toString()}`);
        setJobs(data);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchJobs, 300);
    return () => clearTimeout(t);
  }, [query, type, location]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-navy">Browse Jobs</h1>
      <p className="text-slate-500 mt-1">Find the right opportunity for you</p>

      <div className="mt-6 bg-white rounded-2xl shadow-soft border border-slate-100 p-4 grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => updateParam('q', e.target.value)}
            placeholder="Search jobs..."
            className="w-full outline-none text-sm"
          />
        </div>
        <input
          value={location}
          onChange={(e) => updateParam('location', e.target.value)}
          placeholder="Location"
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-500"
        />
        <select
          value={type}
          onChange={(e) => updateParam('type', e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary-500"
        >
          {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500">No jobs match your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">{jobs.length} jobs found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}