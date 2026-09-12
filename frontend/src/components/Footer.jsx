import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-navy">
            <span className="w-8 h-8 rounded-lg bg-primary-600 text-white grid place-items-center">
              <Briefcase size={16} />
            </span>
            HireLoop
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Connecting talent with opportunity.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-navy mb-3 text-sm">For Candidates</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>Browse Jobs</li>
            <li>My Applications</li>
            <li>Profile</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-navy mb-3 text-sm">For Employers</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>Post a Job</li>
            <li>Dashboard</li>
            <li>Pricing</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-navy mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>About</li>
            <li>Contact</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} HireLoop. All rights reserved.
      </div>
    </footer>
  );
}