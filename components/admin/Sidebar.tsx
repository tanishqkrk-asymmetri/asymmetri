import React from "react";
import Link from "next/link";
import { Briefcase, FileText } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-card text-card-foreground">
      {/* Logo Section */}
      <div className="border-b border-border p-6">
        <div className="flex items-center space-x-3">
          <img
            className="w-40 max-w-full object-contain opacity-90 sm:w-44"
            src="/logo.png"
            alt=""
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Link
            href="/admin/jobs"
            className="group flex items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            <span className="font-medium">Posted Jobs</span>
          </Link>

          <Link
            href="/admin/applications"
            className="group flex items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FileText className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            <span className="font-medium">Applications</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      {/* <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2025 JobPortal. All rights reserved.
        </p>
      </div> */}
    </div>
  );
}
