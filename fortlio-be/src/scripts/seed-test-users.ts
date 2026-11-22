import { mongooseClient } from '../clients';
import User from '../modules/user/models/user.model';
import UserPrivate from '../modules/user/models/user-priv.model';
import Role from '../modules/role/models/role.model';
import CandidateProfile from '../modules/candidate/models/candidate.model';
import HrProfile from '../modules/hr/models/hr.model';

async function seedTestUsers() {
  await mongooseClient.connect();

  const candidateRole = await Role.findOne({ roleName: 'Candidate' });
  const hrRole = await Role.findOne({ roleName: 'HR' });

  if (!candidateRole || !hrRole) {
    console.error('Candidate or HR roles not found in DB!');
    process.exit(1);
  }

  const password = 'Password123!';
  const passwordHash = await Bun.password.hash(password);

  // 1. Candidate User
  let candidateUser = await User.findOne({ email: 'candidate@test.com' });
  if (!candidateUser) {
    candidateUser = await User.create({
      fullName: 'Jane Candidate',
      email: 'candidate@test.com',
      roleId: candidateRole._id,
      isOnboarded: true,
      userPrivileges: candidateRole.rolePrivileges || [],
    });
  } else {
    candidateUser.roleId = candidateRole._id;
    candidateUser.isOnboarded = true;
    candidateUser.userPrivileges = candidateRole.rolePrivileges || [];
    await candidateUser.save();
  }

  let candidatePrivate = await UserPrivate.findOne({ userId: candidateUser._id });
  if (!candidatePrivate) {
    candidatePrivate = await UserPrivate.create({
      userId: candidateUser._id,
      provider: 'EMAIL',
      passwordHash,
      emailVerified: true,
    });
  } else {
    candidatePrivate.passwordHash = passwordHash;
    candidatePrivate.emailVerified = true;
    await candidatePrivate.save();
  }

  let candidateProfile = await CandidateProfile.findOne({ userId: candidateUser._id });
  if (!candidateProfile) {
    candidateProfile = await CandidateProfile.create({
      userId: candidateUser._id,
      mobileNumber: '+1234567890',
      skills: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Docker', 'Distributed Systems'],
      githubUrl: 'https://github.com/janecandidate',
      linkedinUrl: 'https://linkedin.com/in/janecandidate',
      portfolioUrl: 'https://janecandidate.dev',
      headline: 'Staff Full Stack Engineer & Distributed Systems Architect',
      profession: 'Engineering & Technology',
      location: 'San Francisco, CA (Remote)',
      experience: 6,
      learningVelocityScore: 94,
      leadershipTags: ['System Architecture', 'Cross-Functional Mentorship', 'Distributed Systems'],
      topics: ['TypeScript', 'Distributed Systems', 'MongoDB', 'Redis'],
      bio: 'Full Stack Engineer with deep experience building scalable aggregation pipelines, event-driven systems, and authentic software architectures.',
    });
  } else {
    candidateProfile.headline = 'Staff Full Stack Engineer & Distributed Systems Architect';
    candidateProfile.profession = 'Engineering & Technology';
    candidateProfile.location = 'San Francisco, CA (Remote)';
    candidateProfile.experience = 6;
    candidateProfile.skills = ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Docker', 'Distributed Systems'];
    candidateProfile.learningVelocityScore = 94;
    candidateProfile.leadershipTags = ['System Architecture', 'Cross-Functional Mentorship', 'Distributed Systems'];
    candidateProfile.topics = ['TypeScript', 'Distributed Systems', 'MongoDB', 'Redis'];
    candidateProfile.bio = 'Full Stack Engineer with deep experience building scalable aggregation pipelines, event-driven systems, and authentic software architectures.';
    await candidateProfile.save();
  }

  // 1b. Healthcare Candidate (Dr. Sarah Lin)
  let healthUser = await User.findOne({ email: 'sarah.lin@test.com' });
  if (!healthUser) {
    healthUser = await User.create({
      fullName: 'Dr. Sarah Lin',
      email: 'sarah.lin@test.com',
      roleId: candidateRole._id,
      isOnboarded: true,
      userPrivileges: candidateRole.rolePrivileges || [],
    });
  }
  const healthPrivate = await UserPrivate.findOne({ userId: healthUser._id });
  if (!healthPrivate) {
    await UserPrivate.create({
      userId: healthUser._id,
      provider: 'EMAIL',
      passwordHash,
      emailVerified: true,
    });
  }
  const healthProfile = await CandidateProfile.findOne({ userId: healthUser._id });
  if (!healthProfile) {
    await CandidateProfile.create({
      userId: healthUser._id,
      mobileNumber: '+16175550192',
      skills: ['Genomics', 'Bioinformatics', 'Python', 'Statistical Genetics', 'Clinical Trials'],
      headline: 'Principal Clinical Bioinformatician & Research Lead',
      profession: 'Medicine & Healthcare',
      location: 'Boston, MA (Hybrid)',
      experience: 5,
      learningVelocityScore: 91,
      leadershipTags: ['Clinical Protocol Design', 'Research Leadership', 'Peer Mentorship'],
      topics: ['Genomics', 'Computational Biology', 'Variant Discovery'],
      bio: 'Translational bioinformatics researcher translating next-generation sequencing datasets into actionable clinical therapies.',
    });
  }

  // 1c. Design Candidate (Elena Rostova)
  let designUser = await User.findOne({ email: 'elena.rostova@test.com' });
  if (!designUser) {
    designUser = await User.create({
      fullName: 'Elena Rostova',
      email: 'elena.rostova@test.com',
      roleId: candidateRole._id,
      isOnboarded: true,
      userPrivileges: candidateRole.rolePrivileges || [],
    });
  }
  const designPrivate = await UserPrivate.findOne({ userId: designUser._id });
  if (!designPrivate) {
    await UserPrivate.create({
      userId: designUser._id,
      provider: 'EMAIL',
      passwordHash,
      emailVerified: true,
    });
  }
  const designProfile = await CandidateProfile.findOne({ userId: designUser._id });
  if (!designProfile) {
    await CandidateProfile.create({
      userId: designUser._id,
      mobileNumber: '+442079460193',
      skills: ['Figma', 'Design Systems', 'Design Ops', 'User Research', 'Accessibility'],
      headline: 'Senior Lead Product Designer & Design Systems Architect',
      profession: 'Design & Creative Arts',
      location: 'London, UK (Remote)',
      experience: 7,
      learningVelocityScore: 89,
      leadershipTags: ['Design Systems Direction', 'Cross-Disciplinary UX', 'Accessibility Standards'],
      topics: ['Design Systems', 'Design Ops', 'Micro-Interactions'],
      bio: 'Specialized in multi-brand scalable design systems, WCAG 2.2 accessibility, and cross-platform UX paradigms.',
    });
  }

  // 2. HR User
  let hrUser = await User.findOne({ email: 'hr@test.com' });
  if (!hrUser) {
    hrUser = await User.create({
      fullName: 'Alex Recruiter',
      email: 'hr@test.com',
      roleId: hrRole._id,
      isOnboarded: true,
      userPrivileges: hrRole.rolePrivileges || [],
      coins: 5,
    });
  } else {
    hrUser.roleId = hrRole._id;
    hrUser.isOnboarded = true;
    hrUser.userPrivileges = hrRole.rolePrivileges || [];
    hrUser.coins = 5;
    await hrUser.save();
  }

  let hrPrivate = await UserPrivate.findOne({ userId: hrUser._id });
  if (!hrPrivate) {
    hrPrivate = await UserPrivate.create({
      userId: hrUser._id,
      provider: 'EMAIL',
      passwordHash,
      emailVerified: true,
    });
  } else {
    hrPrivate.passwordHash = passwordHash;
    hrPrivate.emailVerified = true;
    await hrPrivate.save();
  }

  let hrProfile = await HrProfile.findOne({ userId: hrUser._id });
  if (!hrProfile) {
    hrProfile = await HrProfile.create({
      userId: hrUser._id,
      mobileNumber: '+1987654321',
      companyName: 'TechCorp Solutions',
      companyWebsite: 'https://techcorp.example.com',
      designation: 'Senior Technical Recruiter',
    });
  }

  console.info('✅ Local test users ready:');
  console.info('Candidate -> Email: candidate@test.com | Password: Password123!');
  console.info('HR / Recruiter -> Email: hr@test.com | Password: Password123!');

  process.exit(0);
}

seedTestUsers().catch((err) => {
  console.error('Failed to seed test users:', err);
  process.exit(1);
});
