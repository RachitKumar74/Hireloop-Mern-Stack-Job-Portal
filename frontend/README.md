# HireLoop – Job Portal

A modern MERN stack job portal connecting job seekers with employers.

---

## 📖 About

HireLoop is a full-stack job portal built with the MERN stack. It has three user
roles — **Job Seeker**, **Employer**, and **Admin** — each with their own dashboard
and features.

Job seekers can browse, search, and apply for jobs. Employers can post jobs and
manage applicants. Admins moderate the platform by approving jobs and managing users.

---

## 🛠️ Tech Stack

| Layer     | Technologies                                        |
|-----------|-----------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router, Axios   |
| Backend   | Node.js, Express.js                                 |
| Database  | MongoDB, Mongoose                                   |
| Auth      | JWT (jsonwebtoken), bcryptjs                        |
| Extras    | Multer (file upload), react-hot-toast, Lucide icons |

---

## 📁 Project Structure

```
HireLoop/
├── frontend/           # React + Vite app
│   ├── src/
│   │   ├── api/        # Axios instance
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth Context
│   │   ├── pages/      # All pages (public + dashboards)
│   │   └── utils/      # Helper functions
│   └── package.json
│
├── backend/            # Express API
│   ├── config/         # DB connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth, error, upload
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── scripts/        # Seed script
│   ├── uploads/        # Uploaded resumes
│   └── server.js
│
├── README.md
├── .gitignore
└── .env.example
```

---

## 👥 User Roles & Features

### 🧑‍💼 Job Seeker
- Register / Login / Logout
- Profile management (name, phone, location, skills)
- Resume upload (PDF/DOC/DOCX)
- Browse & search jobs
- Filter by job type and location
- Apply for jobs with cover letter
- Track application status (Applied / Shortlisted / Rejected / Hired)

### 🏢 Employer
- Register / Login / Logout
- Dashboard with job stats
- Post new jobs
- Edit / Delete own jobs
- View applicants per job
- View applicant's full profile and resume
- Update applicant status

### 🛡️ Admin
- Admin login
- Dashboard with platform stats
- View all users
- Search and filter users
- Delete users (with cascading cleanup)
- View all jobs
- Approve / Reject / Delete jobs

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local) or MongoDB Atlas account

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
npm run dev
```

The backend server will start (default: `http://localhost:5000`).

**Backend `.env` example:**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Seed Demo Data

```bash
cd backend
node scripts/seed.js
```

Seed script creates: 1 admin, 3 employers, 8 job seekers, 5 companies, 15 jobs.

### 4. Running the App

Once both servers are running:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                    | Access     |
|--------|-------------------------------|------------|
| POST   | `/api/auth/register`          | Public     |
| POST   | `/api/auth/login`             | Public     |
| GET    | `/api/auth/me`                | Protected  |
| PUT    | `/api/auth/me`                | Protected  |
| POST   | `/api/auth/upload-resume`     | Protected  |

### Jobs

| Method | Endpoint                      | Access            |
|--------|---------------------------------|--------------------|
| GET    | `/api/jobs`                    | Public             |
| GET    | `/api/jobs/:id`                 | Public             |
| POST   | `/api/jobs`                     | Employer / Admin   |
| PUT    | `/api/jobs/:id`                 | Owner / Admin      |
| DELETE | `/api/jobs/:id`                 | Owner / Admin      |
| GET    | `/api/jobs/employer/mine`       | Employer           |

### Applications

| Method | Endpoint                          | Access            |
|--------|--------------------------------------|--------------------|
| POST   | `/api/applications`                  | Job Seeker         |
| GET    | `/api/applications/mine`             | Job Seeker         |
| GET    | `/api/applications/job/:jobId`       | Employer / Admin   |
| PUT    | `/api/applications/:id/status`       | Employer / Admin   |

### Admin

| Method | Endpoint                          | Access  |
|--------|--------------------------------------|---------|
| GET    | `/api/admin/stats`                   | Admin   |
| GET    | `/api/admin/users`                   | Admin   |
| DELETE | `/api/admin/users/:id`               | Admin   |
| GET    | `/api/admin/jobs`                    | Admin   |
| PUT    | `/api/admin/jobs/:id/status`         | Admin   |
| DELETE | `/api/admin/jobs/:id`                | Admin   |

---

## 🗃️ Database Models

### User

| Field      | Type       | Notes                              |
|------------|------------|-------------------------------------|
| name       | String     | Required                            |
| email      | String     | Required, unique                    |
| password   | String     | Required, hashed with bcryptjs      |
| role       | String     | jobseeker / employer / admin        |
| phone      | String     | Optional                            |
| location   | String     | Optional                            |
| skills     | [String]   | Optional                            |
| resume     | String     | File path                           |

### Job

| Field         | Type       | Notes                                |
|---------------|------------|----------------------------------------|
| title         | String     | Required                               |
| company       | String     | Required                               |
| description   | String     | Required                               |
| requirements  | String     | Optional                               |
| skills        | [String]   | Optional                               |
| location      | String     | Optional                               |
| salary        | String     | Optional                               |
| jobType       | String     | Full-time / Part-time / Internship     |
| experience    | String     | Optional                               |
| postedBy      | ObjectId   | Reference to User                      |
| status        | String     | pending / approved / rejected          |

### Application

| Field         | Type       | Notes                                     |
|---------------|------------|---------------------------------------------|
| job           | ObjectId   | Reference to Job                            |
| applicant     | ObjectId   | Reference to User                           |
| resume        | String     | Snapshot of resume URL at apply time        |
| coverLetter   | String     | Optional                                    |
| status        | String     | Applied / Shortlisted / Rejected / Hired    |

> Unique index on `(job, applicant)` — prevents duplicate applications.

### Company

| Field         | Type       | Notes               |
|---------------|------------|----------------------|
| name          | String     | Required             |
| logo          | String     | Optional             |
| description   | String     | Optional             |
| location      | String     | Optional             |
| website       | String     | Optional             |
| createdBy     | ObjectId   | Reference to User    |

---

## 🔄 Application Workflow

1. Employer posts a job → `status = pending`
2. Admin approves the job → `status = approved`
3. Job is now visible on the public `/jobs` page
4. Job Seeker uploads resume
5. Job Seeker applies with cover letter → Application saved (`status = Applied`)
6. Employer views applicants on dashboard
7. Employer updates status → `Shortlisted` / `Rejected` / `Hired`
8. Job Seeker sees updated status on "My Applications"

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (10 salt rounds)
- **JWT tokens** for stateless authentication
- **Role-based authorization** on protected routes
- Duplicate application prevention (compound index)
- File upload restrictions (PDF/DOC/DOCX only, max 5MB)
- Owner-only access for editing/deleting jobs and applications

---

## 🧪 Available Scripts

**Backend**
| Command         | Description                  |
|------------------|-------------------------------|
| `npm run dev`         | Start server with nodemon     |
| `npm start`           | Start server in production    |
| `node scripts/seed.js`| Seed demo users, companies & jobs |

**Frontend**
| Command           | Description                    |
|--------------------|----------------------------------|
| `npm run dev`      | Start Vite dev server            |
| `npm run build`    | Build production bundle          |
| `npm run preview`  | Preview production build locally |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For questions or feedback, feel free to open an issue in the repository.