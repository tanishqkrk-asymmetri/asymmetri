import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
export type JobType = "Full-time" | "Part-time" | "Internship";
export type JobTeam = "Engineering" | "Designing" | "Marketing";

export interface Job {
  id: string;
  title: string;
  postedOn: string; // Format: YYYY-MM-DD
  description: string;
  technicalRequirements: string[];
  experienceRequired: string;
  team: JobTeam;
  type: JobType;
  location: "Remote";
  payRange: string;
  timestamp: number;
  full_description: string;
}
export async function getJobs(): Promise<Job[]> {
  const fetched = (await getDoc(doc(db, "jobs", "jobs"))).data();
  const final = fetched?.allJobs;
  return Array.isArray(final) ? (final as Job[]) : [];
}

// await new Promise((resolve) => setTimeout(resolve, 200));
