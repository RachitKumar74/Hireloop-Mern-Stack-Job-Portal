export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-navy">Contact Us</h1>
      <p className="mt-2 text-slate-500">We'd love to hear from you. Send us a message.</p>

      <form className="mt-8 bg-white rounded-2xl shadow-soft border border-slate-100 p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-sm font-medium text-navy">Name</label>
          <input className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-navy">Email</label>
          <input type="email" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-navy">Message</label>
          <textarea rows="4" className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary-500 text-sm" />
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition">
          Send Message
        </button>
      </form>
    </div>
  );
}