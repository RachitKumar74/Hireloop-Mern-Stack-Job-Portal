require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Company.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    await User.create({
      name: 'HireLoop Admin',
      email: 'admin@hireloop.com',
      password: 'Admin@12345',
      role: 'admin',
    });

    const employersData = [
      { name: 'Rahul Sharma', email: 'rahul@technova.com' },
      { name: 'Priya Verma', email: 'priya@cloudworks.com' },
      { name: 'Amit Patel', email: 'amit@pixellabs.com' },
    ];
    const employers = await User.create(
      employersData.map((e) => ({
        ...e,
        password: 'Employer@123',
        role: 'employer',
        phone: '9876543210',
        location: 'India',
      }))
    );

    const seekersData = [
      { name: 'Sneha Iyer', email: 'sneha@seeker.com' },
      { name: 'Karan Mehta', email: 'karan@seeker.com' },
      { name: 'Divya Nair', email: 'divya@seeker.com' },
      { name: 'Arjun Reddy', email: 'arjun@seeker.com' },
      { name: 'Neha Singh', email: 'neha@seeker.com' },
      { name: 'Rohan Gupta', email: 'rohan@seeker.com' },
      { name: 'Ananya Das', email: 'ananya@seeker.com' },
      { name: 'Vikram Joshi', email: 'vikram@seeker.com' },
    ];
    await User.create(
      seekersData.map((s) => ({
        ...s,
        password: 'Seeker@123',
        role: 'jobseeker',
        phone: '9000000000',
        location: 'Bangalore',
        skills: ['JavaScript', 'React'],
      }))
    );

    const companiesData = [
      { name: 'TechNova', description: 'Modern product company', location: 'Bangalore', website: 'https://technova.example', createdBy: employers[0]._id },
      { name: 'CloudWorks', description: 'Cloud infrastructure', location: 'Hyderabad', website: 'https://cloudworks.example', createdBy: employers[1]._id },
      { name: 'PixelLabs', description: 'Design-first studio', location: 'Pune', website: 'https://pixellabs.example', createdBy: employers[2]._id },
      { name: 'DataMinds', description: 'Analytics & AI', location: 'Mumbai', website: 'https://dataminds.example', createdBy: employers[0]._id },
      { name: 'ByteCraft', description: 'SaaS products', location: 'Remote', website: 'https://bytecraft.example', createdBy: employers[1]._id },
    ];
    await Company.create(companiesData);

    const jobs = [
      { title: 'Frontend Developer', company: 'TechNova', skills: ['React', 'JavaScript', 'Tailwind'], location: 'Bangalore', salary: '6-10 LPA', jobType: 'Full-time', experience: '1-3 years', postedBy: employers[0]._id },
      { title: 'Backend Developer', company: 'CloudWorks', skills: ['Node.js', 'Express', 'MongoDB'], location: 'Hyderabad', salary: '8-12 LPA', jobType: 'Full-time', experience: '2-4 years', postedBy: employers[1]._id },
      { title: 'UI/UX Intern', company: 'PixelLabs', skills: ['Figma', 'HTML', 'CSS'], location: 'Pune', salary: '15k/month', jobType: 'Internship', experience: '0-1 years', postedBy: employers[2]._id },
      { title: 'Data Analyst', company: 'DataMinds', skills: ['Python', 'SQL', 'Pandas'], location: 'Mumbai', salary: '7-11 LPA', jobType: 'Full-time', experience: '1-3 years', postedBy: employers[0]._id },
      { title: 'DevOps Engineer', company: 'CloudWorks', skills: ['Docker', 'AWS', 'CI/CD'], location: 'Remote', salary: '10-15 LPA', jobType: 'Full-time', experience: '3-5 years', postedBy: employers[1]._id },
      { title: 'React Developer', company: 'ByteCraft', skills: ['React', 'Redux', 'REST'], location: 'Remote', salary: '7-12 LPA', jobType: 'Full-time', experience: '1-3 years', postedBy: employers[1]._id },
      { title: 'Product Designer', company: 'PixelLabs', skills: ['Figma', 'Prototyping'], location: 'Pune', salary: '6-9 LPA', jobType: 'Full-time', experience: '2-4 years', postedBy: employers[2]._id },
      { title: 'Marketing Intern', company: 'TechNova', skills: ['SEO', 'Content'], location: 'Bangalore', salary: '12k/month', jobType: 'Internship', experience: '0-1 years', postedBy: employers[0]._id },
      { title: 'QA Engineer', company: 'ByteCraft', skills: ['Selenium', 'Jest'], location: 'Remote', salary: '5-8 LPA', jobType: 'Full-time', experience: '1-3 years', postedBy: employers[1]._id },
      { title: 'ML Intern', company: 'DataMinds', skills: ['Python', 'Scikit-learn'], location: 'Mumbai', salary: '20k/month', jobType: 'Internship', experience: '0-1 years', postedBy: employers[0]._id },
      { title: 'Node.js Developer', company: 'CloudWorks', skills: ['Node.js', 'MongoDB'], location: 'Hyderabad', salary: '8-12 LPA', jobType: 'Full-time', experience: '2-4 years', postedBy: employers[1]._id },
      { title: 'Content Writer', company: 'PixelLabs', skills: ['Writing', 'SEO'], location: 'Remote', salary: '3-5 LPA', jobType: 'Part-time', experience: '1-2 years', postedBy: employers[2]._id },
      { title: 'Full Stack Developer', company: 'ByteCraft', skills: ['MERN', 'React', 'Node'], location: 'Remote', salary: '9-14 LPA', jobType: 'Full-time', experience: '2-4 years', postedBy: employers[1]._id },
      { title: 'Business Analyst', company: 'DataMinds', skills: ['Excel', 'SQL'], location: 'Mumbai', salary: '6-10 LPA', jobType: 'Full-time', experience: '1-3 years', postedBy: employers[0]._id },
      { title: 'Graphic Design Intern', company: 'PixelLabs', skills: ['Photoshop', 'Illustrator'], location: 'Pune', salary: '10k/month', jobType: 'Internship', experience: '0-1 years', postedBy: employers[2]._id },
    ].map((j) => ({
      ...j,
      description: `We are hiring a ${j.title} at ${j.company}. Join our team and work on exciting projects.`,
      requirements: `Good communication, relevant skills (${j.skills.join(', ')}), and willingness to learn.`,
      status: 'approved',
    }));

    await Job.insertMany(jobs);

    console.log('Seed complete:');
    console.log('  Admin:    admin@hireloop.com / Admin@12345');
    console.log('  Employer: rahul@technova.com / Employer@123');
    console.log('  Seeker:   sneha@seeker.com / Seeker@123');
    console.log(`  ${employers.length} employers, ${seekersData.length} seekers, ${companiesData.length} companies, ${jobs.length} jobs`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();