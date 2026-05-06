"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Clock,
  FileText,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getJobs, Job } from "@/lib/jobs";
import { allSkills } from "@/lib/Skills";
import { Button } from "@/components/ui/button";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const JobAddComponent = () => {
  const params = useParams();
  const jobId = params.jobId;
  const router = useRouter();
  // Sample data - in real app this would come from API based on job ID
  const [job, setJob] = useState<Job | null>({
    id: crypto.randomUUID(),
    title: "",
    postedOn: "",
    description: "",
    technicalRequirements: [],
    team: "Engineering",
    experienceRequired: "",
    full_description: "",
    location: "Remote",
    payRange: "",
    timestamp: Date.now(),
    type: "Full-time",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newRequirement, setNewRequirement] = useState("");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    (async function () {
      const fetched = await getJobs();
      setJobs(fetched);
      if (fetched) {
        // Simulate API call
        const foundJob = fetched.find((j) => j.id === jobId);
        // setJob(foundJob || null);
        setLoading(false);
      }
    })();
  }, []);

  const handleInputChange = (field: keyof Job, value: string) => {
    if (job) {
      setJob({ ...job, [field]: value });
    }
  };

  const handleRequirementAdd = (skill?: string) => {
    if (skill && job) {
      setJob({
        ...job,
        technicalRequirements: [...job.technicalRequirements, skill.trim()],
      });
      setNewRequirement("");
      setSkillSuggestions([]);
      setShowSuggestions(false);
    } else {
      if (newRequirement.trim() && job) {
        setJob({
          ...job,
          technicalRequirements: [
            ...job.technicalRequirements,
            newRequirement.trim(),
          ],
        });
        setNewRequirement("");
        setSkillSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleRequirementRemove = (index: number) => {
    if (job) {
      setJob({
        ...job,
        technicalRequirements: job.technicalRequirements.filter(
          (_, i) => i !== index
        ),
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    console.log(job);
    await setDoc(doc(db, "jobs", "jobs"), {
      allJobs: [...jobs.filter((x) => x.id !== jobId), job],
    });
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert("Job saved successfully!");
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      // Simulate API call
      await setDoc(doc(db, "jobs", "jobs"), {
        allJobs: [...jobs.filter((x) => x.id !== jobId)],
      });
      router.push("/admin/jobs");
      //   await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/jobs")}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
                <p className="text-gray-600 mt-1">Job ID: {job.id}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {/* <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button> */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={job.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posted Date *
                  </label>
                  <input
                    type="date"
                    value={job.postedOn}
                    onChange={(e) =>
                      handleInputChange("postedOn", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Job Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team *
                  </label>
                  <select
                    value={job.team}
                    onChange={(e) => handleInputChange("team", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    value={job.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Required *
                  </label>
                  <select
                    value={job.experienceRequired}
                    onChange={(e) =>
                      handleInputChange("experienceRequired", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Entry level">Entry level</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-3 years">2-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                    <option value="Senior level">Senior level</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{job.location}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay Range *
                  </label>
                  <input
                    type="text"
                    value={job.payRange}
                    onChange={(e) =>
                      handleInputChange("payRange", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>
            </div>

            {/* Technical Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Technical Requirements
              </h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {job.technicalRequirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{requirement}</span>
                      <button
                        onClick={() => handleRequirementRemove(index)}
                        className="ml-2 hover:bg-blue-200 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex flex-col gap-2 relative w-full ">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => {
                        setNewRequirement(e.target.value);
                        // Filter skills based on input
                        if (e.target.value.trim()) {
                          const filtered = allSkills
                            .filter((skill) =>
                              skill
                                .toLowerCase()
                                .includes(e.target.value.toLowerCase())
                            )
                            .slice(0, 10); // Limit to 10 suggestions
                          setSkillSuggestions(filtered);
                          setShowSuggestions(true);
                        } else {
                          setSkillSuggestions([]);
                          setShowSuggestions(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleRequirementAdd();
                          setShowSuggestions(false);
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding suggestions to allow clicks on the suggestions
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      onFocus={() => {
                        if (newRequirement.trim()) {
                          const filtered = allSkills
                            .filter((skill) =>
                              skill
                                .toLowerCase()
                                .includes(newRequirement.toLowerCase())
                            )
                            .slice(0, 10);
                          setSkillSuggestions(filtered);
                          setShowSuggestions(true);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add technical requirement"
                    />
                    {/* Suggestions dropdown */}
                    {showSuggestions && skillSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {skillSuggestions.map((skill, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                            onClick={() => {
                              //   setNewRequirement(skill);
                              handleRequirementAdd(skill);
                              setShowSuggestions(false);
                            }}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      handleRequirementAdd();
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Job Descriptions
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    value={job.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the role"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={job.full_description}
                    onChange={(e) =>
                      handleInputChange("full_description", e.target.value)
                    }
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Detailed job description, responsibilities, requirements, etc."
                  />
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job ID
                  </label>
                  <input
                    type="text"
                    value={job.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timestamp
                  </label>
                  <input
                    type="text"
                    value={new Date(job.timestamp).toLocaleString()}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Section */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Save Changes
              </h3>
              <p className="text-gray-600 text-sm">
                Make sure all required fields are filled out correctly.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/jobs")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Job"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAddComponent;
