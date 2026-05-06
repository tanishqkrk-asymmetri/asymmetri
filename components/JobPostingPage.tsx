"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { getJobs, Job } from "@/lib/jobs";
import Markdown from "react-markdown";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { ApplicationStatus } from "@/lib/application_status";
import { JobApplication } from "@/lib/ApplicationType";

export default function JobPostingPageComponent({
  jobDetails,
}: {
  jobDetails: Job;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  //   const [jobDetails, setJobDetails] = useState<null | Job>(null);
  // Mock job details - in a real app, you'd fetch this based on params.jobPostingId

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // @ts-expect-error ungabunga
      setFormData((prev) => ({
        ...prev,
        resume: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadError(null);
    setUploadProgress(0);
    try {
      let resumeUrl = null;
      if (formData.resume) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.resume);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload resume");
        }

        resumeUrl = data.url;
      }
      const userId = crypto.randomUUID();
      await setDoc(doc(db, "applications", userId), {
        id: userId,
        timestamp: Date.now(),
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        coverLetter: formData.coverLetter,
        jobId: jobDetails.id,
        jobTitle: jobDetails.title,
        status: ApplicationStatus.PENDING,
        resumeUrl: resumeUrl,
      } as JobApplication);

      localStorage.setItem(jobDetails.id, formData.fullName);

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      setIsSubmitting(false);
      setUploadError("Failed to submit application. Please try again later.");
    }
  };

  useEffect(() => {
    const already = localStorage.getItem(jobDetails.id);
    if (already) {
      console.log(already);
      setIsSubmitted(true);
    }
  }, []);

  if (isSubmitted && jobDetails) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card className="border-black/20 shadow-none">
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center ">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
            <p className="text-gray-600 max-w-md mb-6">
              Thank you for applying to the {jobDetails.title} position. We'll
              review your application and get back to you soon.
            </p>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/jobs")}
              className="mt-4"
            >
              Return to all jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {jobDetails ? (
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{jobDetails.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                {jobDetails.location}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                {jobDetails.type}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                {jobDetails.team}
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                {jobDetails.postedOn}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="border-black/20 shadow-none">
                <CardHeader>
                  <CardTitle>About the Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{jobDetails.description}</p>
                  <Markdown>{jobDetails.full_description}</Markdown>
                </CardContent>
              </Card>

              <Card className="border-black/20 shadow-none">
                <CardHeader className="bg-gray-50">
                  <CardTitle>Apply for this Position</CardTitle>
                  <CardDescription>
                    Complete the form below to submit your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="johndoe@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="(123) 456-7890"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume/CV</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="resume"
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                          required
                        />
                        <span className="text-xs text-gray-500">
                          PDF, DOC, DOCX
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">
                        Cover Letter (Optional)
                      </Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        placeholder="Tell us why you're interested in this position..."
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        rows={5}
                      />
                    </div>

                    <CardFooter className="px-0 pt-2 pb-0 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isSubmitting
                          ? `Submitting... ${
                              uploadProgress > 0 ? `(${uploadProgress}%)` : ""
                            }`
                          : "Submit Application"}
                      </Button>
                    </CardFooter>
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-6 border-black/20 shadow-none">
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Salary Range
                      </dt>
                      <dd className="text-emerald-600 font-medium">
                        {jobDetails.payRange}
                      </dd>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Location
                      </dt>
                      <dd>{jobDetails.location}</dd>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Employment Type
                      </dt>
                      <dd>{jobDetails.type}</dd>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Department
                      </dt>
                      <dd>{jobDetails.team}</dd>
                    </div>
                  </dl>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => {
                      const applicationForm = document.querySelector("form");
                      applicationForm?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
