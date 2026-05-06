"use client";
import { useEffect, useState, startTransition } from "react";
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
import { Job } from "@/lib/jobs";
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
      startTransition(() => setIsSubmitted(true));
    }
  }, [jobDetails.id]);

  if (isSubmitted && jobDetails) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-foreground">
        <Card className="border-border shadow-none ring-1 ring-foreground/10">
          <CardContent className="flex flex-col items-center justify-center pt-12 pb-12 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Application Submitted!</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              Thank you for applying to the {jobDetails.title} position.
              We&apos;ll review your application and get back to you soon.
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
        <div className="container mx-auto max-w-6xl px-4 py-12 text-foreground">
          <div className="mb-8">
            <h1 className="mb-2 font-chakra-petch text-3xl font-semibold tracking-wide">
              {jobDetails.title}
            </h1>
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="border border-border bg-muted text-foreground"
              >
                {jobDetails.location}
              </Badge>
              <Badge
                variant="secondary"
                className="border border-border bg-muted text-foreground"
              >
                {jobDetails.type}
              </Badge>
              <Badge
                variant="secondary"
                className="border border-border bg-muted text-foreground"
              >
                {jobDetails.team}
              </Badge>
              <Badge className="border border-asymmetri-red/40 bg-asymmetri-red/15 text-asymmetri-red">
                {jobDetails.postedOn}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
              <Card className="border-border shadow-none ring-1 ring-foreground/10">
                <CardHeader>
                  <CardTitle>About the Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{jobDetails.description}</p>
                  <div className="max-w-none space-y-3 text-muted-foreground [&_a]:text-asymmetri-red [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-sm [&_h1]:text-foreground [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-foreground [&_h2]:font-semibold [&_h3]:text-foreground [&_h3]:font-medium [&_li]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-relaxed [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
                    <Markdown>{jobDetails.full_description}</Markdown>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-none ring-1 ring-foreground/10">
                <CardHeader className="border-b border-border bg-muted/40">
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
                        <span className="text-xs text-muted-foreground">
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

                    <CardFooter className="flex justify-end px-0 pt-2 pb-0">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-asymmetri-red text-white hover:bg-asymmetri-red/90"
                      >
                        {isSubmitting
                          ? `Submitting... ${
                              uploadProgress > 0 ? `(${uploadProgress}%)` : ""
                            }`
                          : "Submit Application"}
                      </Button>
                    </CardFooter>
                    {uploadError && (
                      <p className="mt-2 text-sm text-destructive">
                        {uploadError}
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-6 border-border shadow-none ring-1 ring-foreground/10">
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Salary Range
                      </dt>
                      <dd className="font-medium text-emerald-400">
                        {jobDetails.payRange}
                      </dd>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Location
                      </dt>
                      <dd className="text-foreground">{jobDetails.location}</dd>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Employment Type
                      </dt>
                      <dd className="text-foreground">{jobDetails.type}</dd>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Department
                      </dt>
                      <dd className="text-foreground">{jobDetails.team}</dd>
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
