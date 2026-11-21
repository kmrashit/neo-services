import { useCandidateProfile, ProfileEditForm } from "@/features/candidate";

export default function CandidateEditProfile() {
  const { profile } = useCandidateProfile();

  return <ProfileEditForm initialProfile={profile} />;
}
