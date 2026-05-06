import React from "react";
import Link from "next/link";
import { Briefcase, FileText, Building2 } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white  flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            className="w-48 sm:w-64 md:w-80 lg:w-96 invert-100"
            src="/logo_long.png"
            alt=""
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Link
            href="/admin/jobs"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
          >
            <Briefcase className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            <span className="font-medium">Posted Jobs</span>
          </Link>

          <Link
            href="/admin/applications"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
          >
            <FileText className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
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
