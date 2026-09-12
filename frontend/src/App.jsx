import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import SeekerDashboard from './pages/seeker/SeekerDashboard';
import Profile from './pages/seeker/Profile';
import MyApplications from './pages/seeker/MyApplications';

import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import MyJobs from './pages/employer/MyJobs';
import EditJob from './pages/employer/EditJob';
import Applicants from './pages/employer/Applicants';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageJobs from './pages/admin/ManageJobs';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Job Seeker Dashboard */}
          <Route
            path="/seeker"
            element={
              <ProtectedRoute roles={['jobseeker']}>
                <DashboardLayout
                  title="Job Seeker"
                  links={[
                    { to: '/seeker', label: 'Dashboard' },
                    { to: '/seeker/profile', label: 'Profile & Resume' },
                    { to: '/seeker/applications', label: 'My Applications' },
                    { to: '/jobs', label: 'Browse Jobs' },
                  ]}
                />
              </ProtectedRoute>
            }
          >
            <Route index element={<SeekerDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="applications" element={<MyApplications />} />
          </Route>

          {/* Employer Dashboard */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute roles={['employer']}>
                <DashboardLayout
                  title="Employer"
                  links={[
                    { to: '/employer', label: 'Dashboard' },
                    { to: '/employer/post-job', label: 'Post Job' },
                    { to: '/employer/jobs', label: 'My Jobs' },
                  ]}
                />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployerDashboard />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="jobs" element={<MyJobs />} />
            <Route path="edit-job/:id" element={<EditJob />} />
            <Route path="applicants/:jobId" element={<Applicants />} />
          </Route>

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <DashboardLayout
                  title="Admin"
                  links={[
                    { to: '/admin', label: 'Dashboard' },
                    { to: '/admin/users', label: 'Manage Users' },
                    { to: '/admin/jobs', label: 'Manage Jobs' },
                  ]}
                />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="jobs" element={<ManageJobs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}