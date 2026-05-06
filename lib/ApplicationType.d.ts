import { ApplicationStatus } from "./application_status";

export interface JobApplication {
  id: string;
  timestamp: number;
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  jobId: string;
  jobTitle: string;
  status: ApplicationStatus;
  resumeUrl: string;
}
