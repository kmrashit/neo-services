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
      skills: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
      githubUrl: 'https://github.com/janecandidate',
      linkedinUrl: 'https://linkedin.com/in/janecandidate',
      portfolioUrl: 'https://janecandidate.dev',
      experience: 4,
      bio: 'Full Stack Engineer with 4 years experience building web applications with React and Node.js.',
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

  console.log('✅ Local test users ready:');
  console.log('Candidate -> Email: candidate@test.com | Password: Password123!');
  console.log('HR / Recruiter -> Email: hr@test.com | Password: Password123!');

  process.exit(0);
}

seedTestUsers().catch((err) => {
  console.error('Failed to seed test users:', err);
  process.exit(1);
});
