export interface ICandidateSearchResult {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  mobileNumber?: string;
  skills: string[];
  profession?: string;
  headline?: string;
  bio?: string;
  experience?: number;
  location?: string;
  learningVelocityScore?: number;
  leadershipTags?: string[];
  topics?: string[];
}

export interface ISearchFilter {
  searchKey?: string;
  minExperience?: number;
  skills?: string[];
}

export interface ISearchHistoryItem {
  _id: string;
  userId: string;
  query: string;
  filters?: {
    minExperience?: string;
    skills?: string;
  };
  searchedAt: string;
}

export interface IViewedProfileItem {
  viewedUserId: string;
  viewedAt: string;
  profile?: {
    _id?: string;
    userId: string;
    fullName?: string;
    email?: string;
    skills?: string[];
    profession?: string;
    headline?: string;
    bio?: string;
    experience?: number;
    companyName?: string;
    designation?: string;
  };
}

export interface IHrProfile {
  _id?: string;
  userId: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  companyName: string;
  companyWebsite?: string;
  designation: string;
}

export interface ISearchApiResponse {
  candidates: ICandidateSearchResult[];
  remainingCoins: number;
}
