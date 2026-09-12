import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee } from 'lucide-react';

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 hover:shadow-lg transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-navy text-lg">{job.title}</h3>
          <p className="text-sm text-slate-500">{job.company}</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-600">
          {job.jobType}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
        <span className="inline-flex items-center gap-1"><Briefcase size={14} /> {job.experience}</span>
        <span className="inline-flex items-center gap-1"><IndianRupee size={14} /> {job.salary}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills?.slice(0, 3).map((s) => (
          <span key={s} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600">{s}</span>
        ))}
      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="mt-5 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        View Details →
      </Link>
    </div>
  );
}