import { mongooseClient } from '../clients';
import User from '../modules/user/models/user.model';
import UserPrivate from '../modules/user/models/user-priv.model';
import Role from '../modules/role/models/role.model';
import CandidateProfile from '../modules/candidate/models/candidate.model';
import CandidateBlog from '../modules/candidate/models/candidate-blog.model';
import HrProfile from '../modules/hr/models/hr.model';

interface SeedCandidateData {
  fullName: string;
  email: string;
  mobileNumber: string;
  headline: string;
  profession: string;
  location: string;
  experience: number;
  skills: string[];
  bio: string;
  learningVelocityScore: number;
  leadershipTags: string[];
  topics: string[];
  blogs?: Array<{
    title: string;
    content: string;
    blogKeywords: string[];
  }>;
}

const CANDIDATES_SEED_DATA: SeedCandidateData[] = [
  {
    fullName: 'Jane Candidate',
    email: 'candidate@test.com',
    mobileNumber: '+1234567890',
    headline: 'Staff Full Stack Engineer & Distributed Systems Architect',
    profession: 'Engineering & Technology',
    location: 'San Francisco, CA (Remote)',
    experience: 6,
    skills: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Docker', 'Distributed Systems'],
    bio: 'Full Stack Engineer with deep experience building scalable aggregation pipelines, event-driven systems, and authentic software architectures.',
    learningVelocityScore: 94,
    leadershipTags: ['System Architecture', 'Cross-Functional Mentorship', 'Distributed Systems'],
    topics: ['TypeScript', 'Distributed Systems', 'MongoDB', 'Redis'],
    blogs: [
      {
        title: 'Optimizing MongoDB Aggregation Pipelines for Scale',
        content: 'Deep dive into $facet slicing and secondary replica execution in high-throughput applications.',
        blogKeywords: ['mongodb', 'aggregation', 'performance', 'database'],
      },
    ],
  },
  {
    fullName: 'Dr. Sarah Lin',
    email: 'sarah.lin@test.com',
    mobileNumber: '+16175550192',
    headline: 'Principal Clinical Bioinformatician & Research Lead',
    profession: 'Medicine & Healthcare',
    location: 'Boston, MA (Hybrid)',
    experience: 5,
    skills: ['Genomics', 'Bioinformatics', 'Python', 'Statistical Genetics', 'Clinical Trials'],
    bio: 'Translational bioinformatics researcher translating next-generation sequencing datasets into actionable clinical therapies.',
    learningVelocityScore: 91,
    leadershipTags: ['Clinical Protocol Design', 'Research Leadership', 'Peer Mentorship'],
    topics: ['Genomics', 'Computational Biology', 'Variant Discovery'],
    blogs: [
      {
        title: 'Next-Generation Sequencing Pipeline Automation in Python',
        content: 'Analyzing whole genome variants with parallel processing workflows in clinical environments.',
        blogKeywords: ['genomics', 'bioinformatics', 'python', 'clinical'],
      },
    ],
  },
  {
    fullName: 'Elena Rostova',
    email: 'elena.rostova@test.com',
    mobileNumber: '+442079460193',
    headline: 'Senior Lead Product Designer & Design Systems Architect',
    profession: 'Design & Creative Arts',
    location: 'London, UK (Remote)',
    experience: 7,
    skills: ['Figma', 'Design Systems', 'Design Ops', 'User Research', 'Accessibility'],
    bio: 'Specialized in multi-brand scalable design systems, WCAG 2.2 accessibility, and cross-platform UX paradigms.',
    learningVelocityScore: 89,
    leadershipTags: ['Design Systems Direction', 'Cross-Disciplinary UX', 'Accessibility Standards'],
    topics: ['Design Systems', 'Design Ops', 'Micro-Interactions'],
    blogs: [
      {
        title: 'Building Multi-Brand Design Tokens in Figma & Tailwind',
        content: 'Creating a seamless token pipeline between design mockups and frontend UI libraries.',
        blogKeywords: ['design systems', 'figma', 'ux', 'accessibility'],
      },
    ],
  },
  {
    fullName: 'Alex Mercer',
    email: 'alex.mercer@test.com',
    mobileNumber: '+15553829102',
    headline: 'Staff Systems Engineer & Cloud Native Architect',
    profession: 'Engineering & Technology',
    location: 'San Francisco, CA (Remote)',
    experience: 8,
    skills: ['TypeScript', 'Go', 'Distributed Systems', 'Kubernetes', 'Kafka', 'Redis', 'MongoDB'],
    bio: 'Passionate systems engineer focused on high-throughput event streaming, distributed consensus, and developer tooling. Author of technical blogs on Kafka pipelines and TypeScript compilation architectures.',
    learningVelocityScore: 96,
    leadershipTags: ['Production Resilience', 'System Architecture', 'Cross-Functional Mentorship'],
    topics: ['Distributed Systems', 'Event-Driven Architecture', 'Pipeline Optimization'],
    blogs: [
      {
        title: 'Architecting Event-Driven Microservices with Kafka and Go',
        content: 'Managing distributed state and outbox patterns under 50,000 events per second.',
        blogKeywords: ['kafka', 'distributed systems', 'go', 'architecture'],
      },
    ],
  },
  {
    fullName: 'Marcus Vance, Esq.',
    email: 'marcus.vance@test.com',
    mobileNumber: '+12025550114',
    headline: 'Senior Regulatory Counsel & Tech Governance Specialist',
    profession: 'Law & Legal Services',
    location: 'Washington, DC',
    experience: 9,
    skills: ['Tech Governance', 'AI Ethics', 'IP Law', 'GDPR', 'Compliance', 'Regulatory Strategy'],
    bio: 'Advising high-growth technology corporations on frontier AI compliance, IP portfolio protection, and global regulatory frameworks.',
    learningVelocityScore: 88,
    leadershipTags: ['Regulatory Strategy', 'Policy Authorship', 'Corporate Governance'],
    topics: ['AI Governance', 'Cross-Border Compliance', 'IP Law'],
    blogs: [
      {
        title: 'Global AI Governance and Model Copyright Compliance Frameworks',
        content: 'A legal roadmap for engineering teams deploying generative AI applications internationally.',
        blogKeywords: ['tech governance', 'ai ethics', 'ip law', 'gdpr'],
      },
    ],
  },
  {
    fullName: 'Maya Patel',
    email: 'maya.patel@test.com',
    mobileNumber: '+14155550188',
    headline: 'Principal Product Manager & FinTech Growth Lead',
    profession: 'Business & Management',
    location: 'New York, NY (Hybrid)',
    experience: 7,
    skills: ['Product Strategy', 'Agile', 'FinTech', 'User Growth', 'Roadmap Planning', 'Data Analytics'],
    bio: 'Product leader driving 0-to-1 consumer and enterprise financial applications. Focused on quantifiable unit economics, experimentation frameworks, and customer-first roadmaps.',
    learningVelocityScore: 92,
    leadershipTags: ['Product Vision', 'Stakeholder Alignment', 'Growth Experimentation'],
    topics: ['FinTech', 'Product Growth', 'Data-Driven Roadmaps'],
    blogs: [
      {
        title: 'Designing FinTech Onboarding Flows That Convert at 78%',
        content: 'How micro-friction and progressive KYC verification improve both compliance and user retention.',
        blogKeywords: ['fintech', 'product management', 'growth', 'analytics'],
      },
    ],
  },
  {
    fullName: 'Dr. David Chen, MD',
    email: 'david.chen@test.com',
    mobileNumber: '+13125550172',
    headline: 'Clinical Director & Digital Health Specialist',
    profession: 'Medicine & Healthcare',
    location: 'Chicago, IL',
    experience: 11,
    skills: ['Clinical Workflows', 'Telehealth', 'EHR Systems', 'Health Informatics', 'Cardiology'],
    bio: 'Board-certified cardiologist bridging clinical care delivery with digital health interoperability, FHIR standards, and physician-centric EHR tooling.',
    learningVelocityScore: 90,
    leadershipTags: ['Clinical Governance', 'Digital Health Strategy', 'Interdisciplinary Care'],
    topics: ['Digital Health', 'Cardiology Informatics', 'Telehealth'],
    blogs: [
      {
        title: 'Integrating FHIR Standards into Modern Telehealth Portals',
        content: 'Overcoming legacy EHR barriers to empower patient-facing cardiovascular monitoring.',
        blogKeywords: ['digital health', 'clinical workflows', 'telehealth', 'healthcare'],
      },
    ],
  },
  {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@test.com',
    mobileNumber: '+12065550143',
    headline: 'Staff AI/ML Research Engineer & LLM Specialist',
    profession: 'Engineering & Technology',
    location: 'Seattle, WA (Remote)',
    experience: 6,
    skills: ['Python', 'PyTorch', 'Large Language Models', 'NLP', 'Deep Learning', 'MLOps', 'Transformers'],
    bio: 'Machine learning scientist specializing in fine-tuning open-weights models, retrieval-augmented generation architectures, and low-latency LLM inference pipelines.',
    learningVelocityScore: 97,
    leadershipTags: ['AI Research', 'Model Optimization', 'Technical Mentorship'],
    topics: ['Large Language Models', 'RAG Pipelines', 'Quantization'],
    blogs: [
      {
        title: 'Sub-10ms RAG Pipelines with Vector Caching and Hybrid Search',
        content: 'Combining lexical BM25 and dense vector representations for production enterprise QA bots.',
        blogKeywords: ['ai', 'machine learning', 'pytorch', 'llm', 'nlp'],
      },
    ],
  },
  {
    fullName: 'Liam O\'Connor',
    email: 'liam.oconnor@test.com',
    mobileNumber: '+15125550199',
    headline: 'Lead Site Reliability Engineer & Platform Architect',
    profession: 'Engineering & Technology',
    location: 'Austin, TX',
    experience: 8,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'CI/CD', 'Prometheus', 'Grafana', 'Go'],
    bio: 'SRE architect maintaining multi-region Kubernetes clusters with 99.99% SLA. Specialized in GitOps, infrastructure as code, and automated chaos engineering.',
    learningVelocityScore: 93,
    leadershipTags: ['Site Reliability', 'Incident Management', 'Platform Engineering'],
    topics: ['Kubernetes', 'Cloud Infrastructure', 'Chaos Engineering'],
    blogs: [
      {
        title: 'Zero-Downtime Multi-Region Kubernetes Failover Architecture',
        content: 'Automating Route53 latency routing and cross-region state replication for critical services.',
        blogKeywords: ['kubernetes', 'devops', 'aws', 'terraform', 'sre'],
      },
    ],
  },
  {
    fullName: 'Sophia Taylor',
    email: 'sophia.taylor@test.com',
    mobileNumber: '+13105550165',
    headline: 'Principal UX Researcher & Accessibility Specialist',
    profession: 'Design & Creative Arts',
    location: 'Los Angeles, CA',
    experience: 7,
    skills: ['User Research', 'Accessibility', 'WCAG', 'Usability Testing', 'Design Thinking'],
    bio: 'Dedicated to inclusive digital products. Leading qualitative and quantitative user research studies across diverse demographic cohorts.',
    learningVelocityScore: 89,
    leadershipTags: ['Inclusive Design', 'Research Methodologies', 'Accessibility Advocacy'],
    topics: ['Accessibility', 'Inclusive Research', 'WCAG Standards'],
    blogs: [
      {
        title: 'Conducting Usability Studies with Screen Reader Users',
        content: 'Practical methodologies to uncover navigation bottlenecks and improve assistive tech compatibility.',
        blogKeywords: ['accessibility', 'user research', 'ux', 'inclusive design'],
      },
    ],
  },
];

async function seedTestUsers() {
  await mongooseClient.connect();

  const candidateRole = await Role.findOne({ roleName: 'Candidate' });
  const hrRole = await Role.findOne({ roleName: 'HR' });

  if (!candidateRole || !hrRole) {
    console.error('Candidate or HR roles not found in DB!');
    process.exit(1);
  }

  const defaultPassword = 'Password123!';
  const passwordHash = await Bun.password.hash(defaultPassword);

  // 1. Seed Candidates
  for (const cand of CANDIDATES_SEED_DATA) {
    let user = await User.findOne({ email: cand.email });
    if (!user) {
      user = await User.create({
        fullName: cand.fullName,
        email: cand.email,
        roleId: candidateRole._id,
        isOnboarded: true,
        userPrivileges: candidateRole.rolePrivileges || [],
        coins: 10,
      });
    } else {
      user.fullName = cand.fullName;
      user.roleId = candidateRole._id;
      user.isOnboarded = true;
      user.userPrivileges = candidateRole.rolePrivileges || [];
      await user.save();
    }

    const priv = await UserPrivate.findOne({ userId: user._id });
    if (!priv) {
      await UserPrivate.create({
        userId: user._id,
        provider: 'EMAIL',
        passwordHash,
        emailVerified: true,
      });
    } else {
      priv.passwordHash = passwordHash;
      priv.emailVerified = true;
      await priv.save();
    }

    let profile = await CandidateProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await CandidateProfile.create({
        userId: user._id,
        mobileNumber: cand.mobileNumber,
        headline: cand.headline,
        profession: cand.profession,
        location: cand.location,
        experience: cand.experience,
        skills: cand.skills,
        bio: cand.bio,
        learningVelocityScore: cand.learningVelocityScore,
        leadershipTags: cand.leadershipTags,
        topics: cand.topics,
      });
    } else {
      profile.mobileNumber = cand.mobileNumber;
      profile.headline = cand.headline;
      profile.profession = cand.profession;
      profile.location = cand.location;
      profile.experience = cand.experience;
      profile.skills = cand.skills;
      profile.bio = cand.bio;
      profile.learningVelocityScore = cand.learningVelocityScore;
      profile.leadershipTags = cand.leadershipTags;
      profile.topics = cand.topics;
      await profile.save();
    }

    // Seed blogs
    if (cand.blogs && cand.blogs.length > 0) {
      for (const b of cand.blogs) {
        await CandidateBlog.findOneAndUpdate(
          { candidateId: user._id, title: b.title },
          {
            candidateId: user._id,
            title: b.title,
            content: b.content,
            blogKeywords: b.blogKeywords,
            status: 'published',
          },
          { upsert: true, new: true },
        );
      }
    }
  }

  // 2. Seed HR User with 50 Coins
  let hrUser = await User.findOne({ email: 'hr@test.com' });
  if (!hrUser) {
    hrUser = await User.create({
      fullName: 'Alex Recruiter',
      email: 'hr@test.com',
      roleId: hrRole._id,
      isOnboarded: true,
      userPrivileges: hrRole.rolePrivileges || [],
      coins: 50,
    });
  } else {
    hrUser.fullName = 'Alex Recruiter';
    hrUser.roleId = hrRole._id;
    hrUser.isOnboarded = true;
    hrUser.userPrivileges = hrRole.rolePrivileges || [];
    hrUser.coins = 50;
    await hrUser.save();
  }

  const hrPrivate = await UserPrivate.findOne({ userId: hrUser._id });
  if (!hrPrivate) {
    await UserPrivate.create({
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

  const hrProfile = await HrProfile.findOne({ userId: hrUser._id });
  if (!hrProfile) {
    await HrProfile.create({
      userId: hrUser._id,
      mobileNumber: '+1987654321',
      companyName: 'TechCorp Solutions',
      companyWebsite: 'https://techcorp.example.com',
      designation: 'Senior Technical Recruiter',
    });
  }

  console.info('✅ Database seeded with 10 diverse candidates across all disciplines:');
  CANDIDATES_SEED_DATA.forEach((c) => console.info(`- ${c.fullName} (${c.profession}) - Skills: ${c.skills.slice(0, 3).join(', ')}`));
  console.info(`✅ HR User (hr@test.com) coins set to: ${hrUser.coins}`);
  console.info('Candidate Login -> Email: candidate@test.com | Password: Password123!');
  console.info('HR Login -> Email: hr@test.com | Password: Password123!');

  process.exit(0);
}

seedTestUsers().catch((err) => {
  console.error('Failed to seed test users:', err);
  process.exit(1);
});
