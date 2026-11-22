/**
 * Fortlio Universal Professional Taxonomy
 * Covers candidates and professionals across all disciplines, backgrounds, specialties, and education paths.
 */

export interface ProfessionCategory {
  id: string;
  name: string;
  iconName: string;
  specialties: string[];
}

export const PROFESSIONS_TAXONOMY: ProfessionCategory[] = [
  {
    id: 'tech-software',
    name: 'Engineering & Technology',
    iconName: 'Code2',
    specialties: [
      'Distributed Systems', 'Frontend Architecture', 'Cloud Infrastructure', 'DevOps & SRE',
      'AI / Machine Learning', 'Data Engineering', 'Cybersecurity', 'Embedded Systems',
      'Mobile Applications', 'Database Engineering', 'Blockchain / Web3',
    ],
  },
  {
    id: 'healthcare-medicine',
    name: 'Healthcare & Medicine',
    iconName: 'Stethoscope',
    specialties: [
      'Clinical Medicine', 'Nursing & Patient Care', 'Surgical Specialties', 'Medical Research',
      'Pharmacology', 'Public Health & Epidemiology', 'Radiology & Imaging', 'Psychiatry & Mental Health',
      'Biomedical Informatics', 'Pediatrics',
    ],
  },
  {
    id: 'design-creative',
    name: 'Design & Creative Arts',
    iconName: 'Palette',
    specialties: [
      'Product & UI/UX Design', 'Design Systems', 'Visual Identity & Branding', 'Motion Graphics',
      'Industrial & Hardware Design', 'Architectural Design', 'Interior Architecture', 'Game Design & 3D',
    ],
  },
  {
    id: 'law-legal',
    name: 'Law & Legal Services',
    iconName: 'Scale',
    specialties: [
      'Corporate & M&A Law', 'Intellectual Property & Patents', 'Litigation & Dispute Resolution',
      'Regulatory Compliance', 'Privacy & Data Protection Law', 'Constitutional Law', 'Environmental Law',
    ],
  },
  {
    id: 'finance-accounting',
    name: 'Finance, Banking & Accounting',
    iconName: 'TrendingUp',
    specialties: [
      'Investment Banking', 'Quantitative Finance', 'Corporate FP&A', 'Venture Capital & Private Equity',
      'Auditing & CPA Accounting', 'Risk Management & Underwriting', 'Financial Modeling', 'Tax Strategy',
    ],
  },
  {
    id: 'science-research',
    name: 'Science & Scientific Research',
    iconName: 'FlaskConical',
    specialties: [
      'Genomics & Bioinformatics', 'Molecular Biology', 'Astrophysics & Space Science',
      'Organic Chemistry', 'Quantum Physics', 'Renewable Energy Research', 'Materials Science',
    ],
  },
  {
    id: 'marketing-growth',
    name: 'Marketing, Growth & Media',
    iconName: 'Megaphone',
    specialties: [
      'Brand Strategy & Positioning', 'Growth Engineering & Analytics', 'Product Marketing (PMM)',
      'Technical Content & Journalism', 'Performance Marketing & SEO', 'Public Relations & Communications',
    ],
  },
  {
    id: 'business-operations',
    name: 'Business, Strategy & Management',
    iconName: 'Briefcase',
    specialties: [
      'Product Management', 'Strategic Operations (BizOps)', 'Supply Chain & Logistics',
      'People Operations & Talent Acquisition', 'Executive Leadership', 'Management Consulting',
    ],
  },
  {
    id: 'education-academia',
    name: 'Education, Teaching & Academia',
    iconName: 'GraduationCap',
    specialties: [
      'Curriculum Design & Pedagogy', 'Higher Education Instruction', 'Educational Technology (EdTech)',
      'Academic Publishing & Peer Review', 'STEM Instruction', 'Special Education',
    ],
  },
];

export const EDUCATION_LEVELS = [
  'High School / Secondary',
  'Vocational / Technical Certification',
  'Associate Degree (AA / AS / AAS)',
  "Bachelor's Degree (BA / BS / BFA / B.Tech / BBA)",
  "Master's Degree (MA / MS / MBA / MFA / M.Tech)",
  'Professional Doctorate (MD / JD / DO / DDS / PharmD)',
  'Doctor of Philosophy (Ph.D. / Ed.D. / D.Sc.)',
  'Postdoctoral Fellow / Specialized Residency',
  'Self-Taught / Industry Practitioner',
];

export const INDUSTRIES_LIST = [
  'Technology & Software',
  'Healthcare & Life Sciences',
  'Financial Services & FinTech',
  'Legal Services',
  'Education & EdTech',
  'Manufacturing & Hardware',
  'Media, Entertainment & Publishing',
  'Biotechnology & Pharmaceuticals',
  'Aerospace & Defense',
  'Energy & CleanTech',
  'Retail, E-Commerce & Consumer Goods',
  'Government, Public Sector & Non-Profit',
  'Real Estate, Architecture & Construction',
];
