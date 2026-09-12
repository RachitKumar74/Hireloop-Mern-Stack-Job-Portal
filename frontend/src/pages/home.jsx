import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, FileText, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';

const categories = [
  { name: 'Engineering', count: 120, icon: '💻' },
  { name: 'Design', count: 45, icon: '🎨' },
  { name: 'Marketing', count: 60, icon: '📈' },
  { name: 'Finance', count: 30, icon: '💰' },
  { name: 'Sales', count: 55, icon: '🤝' },
  { name: 'Support', count: 40, icon: '🎧' },
];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs').then((res) => setJobs(res.data)).catch(() => setJobs([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              #1 Job Portal for Students
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-navy leading-tight">
              Find your <span className="text-primary-600">dream job</span> today
            </h1>
            <p className="mt-4 text-slate-600">
              Explore thousands of jobs from top companies. Apply in one click with your HireLoop profile.
            </p>

            <form onSubmit={handleSearch} className="mt-8 bg-white rounded-2xl shadow-soft p-3 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3 py-2 border border-slate-200 rounded-xl">
                <Search size={18} className="text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, skill, or company"
                  className="w-full outline-none text-sm"
                />
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2 rounded-xl transition">
                Search
              </button>
            </form>
          </div>

          <div className="hidden md:block">
            <div className="bg-white rounded-3xl shadow-soft p-6 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Briefcase, label: 'Live Jobs', value: '1,200+' },
                  { icon: Users, label: 'Companies', value: '350+' },
                  { icon: FileText, label: 'Applications', value: '8,500+' },
                  { icon: MapPin, label: 'Cities', value: '40+' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-4 rounded-2xl bg-slate-50">
                    <Icon className="text-primary-600" size={20} />
                    <p className="mt-2 text-xl font-bold text-navy">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-navy">Popular Categories</h2>
        <p className="text-slate-500 text-sm mt-1">Browse jobs by category</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/jobs?q=${c.name}`}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft hover:shadow-lg transition text-center"
            >
              <div className="text-2xl">{c.icon}</div>
              <p className="mt-2 font-semibold text-navy text-sm">{c.name}</p>
              <p className="text-xs text-slate-500">{c.count} jobs</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy">Featured Jobs</h2>
            <p className="text-slate-500 text-sm mt-1">Hand-picked opportunities for you</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.slice(0, 6).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-navy text-center">How HireLoop Works</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Create Profile', desc: 'Sign up as a job seeker or employer in seconds.' },
            { step: '02', title: 'Search & Apply', desc: 'Browse jobs, filter by type, location and skills.' },
            { step: '03', title: 'Get Hired', desc: 'Track your applications and land the offer.' },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white grid place-items-center font-bold">
                {s.step}
              </div>
              <h3 className="mt-4 font-semibold text-navy">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-primary-600 text-white p-10 md:p-14 text-center shadow-soft">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to start your career?</h2>
          <p className="mt-2 text-primary-100">Join thousands of students finding jobs on HireLoop.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/register" className="bg-white text-primary-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition">
              Get Started
            </Link>
            <Link to="/jobs" className="border border-white/40 font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10 transition">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}