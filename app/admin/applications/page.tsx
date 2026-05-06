"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  X,
  UserCheck,
  Coffee,
  Trophy,
} from "lucide-react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";

export default function AdminApplications() {
  return (
    <div className="w-full">
      <ApplicationsTable />
    </div>
  );
}

// Application interface and enum
enum ApplicationStatus {
  PENDING = 0,
  REJECTED = 1,
  INTERVIEW_PENDING = 2,
  BENCHED = 3,
  HIRED = 4,
}

interface Application {
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

const ApplicationsTable = () => {
  // Sample data - replace with API call
  const [applications, setApplications] = useState<Application[]>([]);

  const getApplications = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "applications"));
    const loaded: Application[] = [];
    querySnapshot.forEach((d) => {
      loaded.push(d.data() as Application);
    });
    setApplications(loaded);
  }, []);

  useEffect(() => {
    (async function () {
      await getApplications();
    })();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL"
  );

  const getStatusConfig = (status: ApplicationStatus) => {
    const configs = {
      [ApplicationStatus.PENDING]: {
        label: "Pending",
        color:
          "border-amber-500/40 bg-amber-500/15 text-amber-200 [&>option]:bg-card [&>option]:text-foreground",
        icon: Clock,
      },
      [ApplicationStatus.REJECTED]: {
        label: "Rejected",
        color:
          "border-red-500/40 bg-red-500/15 text-red-200 [&>option]:bg-card [&>option]:text-foreground",
        icon: X,
      },
      [ApplicationStatus.INTERVIEW_PENDING]: {
        label: "Interview Pending",
        color:
          "border-sky-500/40 bg-sky-500/15 text-sky-200 [&>option]:bg-card [&>option]:text-foreground",
        icon: UserCheck,
      },
      [ApplicationStatus.BENCHED]: {
        label: "Benched",
        color:
          "border-violet-500/40 bg-violet-500/15 text-violet-200 [&>option]:bg-card [&>option]:text-foreground",
        icon: Coffee,
      },
      [ApplicationStatus.HIRED]: {
        label: "Hired",
        color:
          "border-emerald-500/40 bg-emerald-500/15 text-emerald-200 [&>option]:bg-card [&>option]:text-foreground",
        icon: Trophy,
      },
    };
    return configs[status];
  };

  const handleStatusChange = (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleViewResume = (resumeUrl: string) => {
    window.open(resumeUrl, "_blank");
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    // return applications;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      pending: applications.filter(
        (app) => app.status === ApplicationStatus.PENDING
      ).length,
      interviewed: applications.filter(
        (app) => app.status === ApplicationStatus.INTERVIEW_PENDING
      ).length,
      hired: applications.filter(
        (app) => app.status === ApplicationStatus.HIRED
      ).length,
      rejected: applications.filter(
        (app) => app.status === ApplicationStatus.REJECTED
      ).length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen w-full min-w-full bg-background p-6 text-foreground">
      <div className="mx-auto w-full max-w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Applications Management
          </h1>
          <p className="text-muted-foreground">
            Review and manage job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-amber-400">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-400/80" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interview</p>
                <p className="text-2xl font-bold text-sky-400">
                  {stats.interviewed}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-sky-400/80" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hired</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {stats.hired}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-emerald-400/80" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-400">
                  {stats.rejected}
                </p>
              </div>
              <X className="h-8 w-8 text-red-400/80" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="relative">
              <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value === "ALL"
                      ? "ALL"
                      : (parseInt(e.target.value) as ApplicationStatus)
                  )
                }
                className="min-w-48 appearance-none rounded-lg border border-input bg-card py-2 pl-10 pr-8 text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
              >
                <option value="ALL">All Statuses</option>
                <option value={ApplicationStatus.PENDING}>Pending</option>
                <option value={ApplicationStatus.INTERVIEW_PENDING}>
                  Interview Pending
                </option>
                <option value={ApplicationStatus.HIRED}>Hired</option>
                <option value={ApplicationStatus.BENCHED}>Benched</option>
                <option value={ApplicationStatus.REJECTED}>Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Applicant
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Job Applied
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Cover Letter
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Applied Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredApplications.map((application) => {
                  const statusConfig = getStatusConfig(application.status);

                  return (
                    <tr key={application.id} className="hover:bg-muted/40">
                      <td className="p-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-asymmetri-red/15">
                            <User className="h-5 w-5 text-asymmetri-red" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {application.name}
                            </p>
                            {/* <p className="text-sm text-gray-500">
                              ID: {application.id}
                            </p> */}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {application.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {application.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {application.jobTitle}
                          </p>
                          {/* <p className="text-sm text-gray-500">
                            Job ID: {application.jobId}
                          </p> */}
                        </div>
                      </td>
                      <td className="p-2 max-w-xs">
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {truncateText(application.coverLetter, 150)}
                        </p>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {formatDate(application.timestamp)}
                          </span>
                        </div>
                      </td>
                      <td className="p-2">
                        <select
                          value={application.status}
                          onChange={(e) => {
                            handleStatusChange(
                              application.id,
                              parseInt(e.target.value) as ApplicationStatus
                            );
                            setDoc(doc(db, "applications", application.id), {
                              ...application,
                              status: parseInt(e.target.value),
                            });
                          }}
                          className={`rounded-full border px-3 py-1 text-sm font-medium focus:ring-2 focus:ring-ring ${statusConfig?.color}`}
                        >
                          <option value={ApplicationStatus.PENDING}>
                            Pending
                          </option>
                          <option value={ApplicationStatus.INTERVIEW_PENDING}>
                            Interview Pending
                          </option>
                          <option value={ApplicationStatus.HIRED}>Hired</option>
                          <option value={ApplicationStatus.BENCHED}>
                            Benched
                          </option>
                          <option value={ApplicationStatus.REJECTED}>
                            Rejected
                          </option>
                        </select>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleViewResume(application.resumeUrl)
                            }
                            className="flex items-center space-x-1 rounded-lg bg-asymmetri-red px-3 py-1.5 text-sm text-white transition-colors hover:bg-asymmetri-red/90"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Resume</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredApplications.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">
                No applications found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {filteredApplications.length} of {applications.length}{" "}
          applications
        </div>
      </div>
    </div>
  );
};
