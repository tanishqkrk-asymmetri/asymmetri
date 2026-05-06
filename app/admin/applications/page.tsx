"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Eye,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  Check,
  X,
  UserCheck,
  Coffee,
  Trophy,
} from "lucide-react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
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
    let final: Application[] = [];
    querySnapshot.forEach((doc) => {
      final.push(doc.data() as Application);
      setApplications((org) => [...org, doc.data() as Application]);
    });
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
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      [ApplicationStatus.REJECTED]: {
        label: "Rejected",
        color: "bg-red-100 text-red-800",
        icon: X,
      },
      [ApplicationStatus.INTERVIEW_PENDING]: {
        label: "Interview Pending",
        color: "bg-blue-100 text-blue-800",
        icon: UserCheck,
      },
      [ApplicationStatus.BENCHED]: {
        label: "Benched",
        color: "bg-purple-100 text-purple-800",
        icon: Coffee,
      },
      [ApplicationStatus.HIRED]: {
        label: "Hired",
        color: "bg-green-100 text-green-800",
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
    <div className="p-6 bg-gray-50 min-h-screen w-full min-w-full">
      <div className="max-w-full w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Applications Management
          </h1>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interview</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.interviewed}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hired</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.hired}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <X className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value === "ALL"
                      ? "ALL"
                      : (parseInt(e.target.value) as ApplicationStatus)
                  )
                }
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Applicant
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Job Applied
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Cover Letter
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Applied Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => {
                  const statusConfig = getStatusConfig(application.status);
                  const StatusIcon = statusConfig?.icon;

                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
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
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {application.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {application.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {application.jobTitle}
                          </p>
                          {/* <p className="text-sm text-gray-500">
                            Job ID: {application.jobId}
                          </p> */}
                        </div>
                      </td>
                      <td className="p-2 max-w-xs">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {truncateText(application.coverLetter, 150)}
                        </p>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
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
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${statusConfig?.color}`}
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 transition-colors"
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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredApplications.length} of {applications.length}{" "}
          applications
        </div>
      </div>
    </div>
  );
};
