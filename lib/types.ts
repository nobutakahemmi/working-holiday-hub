export type Interest =
  | "ski/snow"
  | "hospitality"
  | "farm/harvest"
  | "hostels"
  | "tourism"
  | "office";

export const INTERESTS: Interest[] = [
  "ski/snow",
  "hospitality",
  "farm/harvest",
  "hostels",
  "tourism",
  "office",
];

export type EligibilityRow = {
  destination: string;
  passport: string;
  eligible: boolean;
  age_min: number | null;
  age_max: number | null;
  max_stay_months: number | null;
  annual_quota: number | "unlimited" | null;
  fee: string | null;
  funds_required: string | null;
  work_restrictions: string | null;
  second_stay: boolean | string | null;
  official_url: string;
  last_verified: string;
  notes: string | null;
};

export type Hub = {
  id: string;
  name: string;
  destination: string;
  region: string;
  season: string;
  typical_jobs: string[];
  interests: Interest[];
};

export type Job = {
  slug: string;
  title: string;
  employer: string;
  verified_employer: boolean;
  commission_only: boolean;
  location: string;
  hub: string;
  season_start: string;
  season_end: string;
  pay: string;
  housing_provided: boolean;
  language_required: string;
  visa_types_accepted: string[];
  role_types: Interest[];
  headcount: number;
  summary: string;
  posted_at: string;
};

export type MatcherInput = {
  passport: string;
  age: number;
  startMonth: string;
  interests: Interest[];
};

export type MatchResult = {
  row: EligibilityRow;
  qualifies: boolean;
  reasons: string[];
  hubs: Hub[];
};

export type Profile = {
  email: string;
  passport: string;
  ageRange: string;
  availableFrom: string;
  availableTo: string;
  minCommitmentMonths: string;
  languages: string;
  japaneseLevel: string;
  experience: string;
  references: string;
  certificates: string;
  interests: Interest[];
};
