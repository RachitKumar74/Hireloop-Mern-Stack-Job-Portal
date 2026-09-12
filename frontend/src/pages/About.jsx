export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-navy">About HireLoop</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        HireLoop is a modern job portal that connects students and fresh graduates with
        employers looking for talent. Our goal is to make the job search experience
        simple, transparent, and fast — from browsing jobs to tracking your applications.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {[
          { title: 'For Job Seekers', desc: 'Create a profile, upload your resume, and apply to jobs in one click.' },
          { title: 'For Employers', desc: 'Post jobs, manage listings, and review applicants from a single dashboard.' },
          { title: 'For Admins', desc: 'Moderate users, approve jobs, and keep the platform clean and trustworthy.' },
        ].map((c) => (
          <div key={c.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
            <h2 className="font-semibold text-navy">{c.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}