import CareersViewLayout from "@/components/CareersViewLayout";
import { Suspense } from "react";

export default async function CareersPage() {
  return (
    <Suspense>
      <main className="space-y-16 ">
        <div className="mb-16" id="header"></div>
        <div className=" flex flex-col justify-center items-center gap-3 py-8 px-4 sm:py-12 md:py-16">
          <img
            className="w-48 sm:w-64 md:w-80 lg:w-96 invert-100"
            src="/logo_long.png"
            alt=""
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center text-center sm:text-left">
            <div className="text-xl sm:text-2xl font-semibold">
              Join our team
            </div>
            <div className="text-red-500 text-sm sm:text-base">
              We're hiring
            </div>
          </div>
          <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl text-center px-4 text-sm sm:text-base">
            Asymmetri: A global team of top-tier creatives, where talent knows
            no borders. We pride ourselves on recruiting only the coolest and
            most skilled individuals.
          </div>
        </div>
        <CareersViewLayout></CareersViewLayout>
      </main>
    </Suspense>
  );
}
