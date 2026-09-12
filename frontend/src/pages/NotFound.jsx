import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="mt-3 text-lg font-semibold text-navy">Page not found</p>
      <p className="mt-1 text-slate-500 text-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl"
      >
        Back to Home
      </Link>
    </div>
  );
}