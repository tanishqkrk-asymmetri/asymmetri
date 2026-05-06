import CareersViewLayout from "@/components/CareersViewLayout";
import { Suspense } from "react";

export default async function CareersPage() {
  return (
    <Suspense>
      <main className="heroDark min-h-screen space-y-16 pb-20 text-foreground">
        <div className="mb-16" id="header"></div>
        <div className="flex flex-col justify-center items-center gap-3 py-8 px-4 sm:py-12 md:py-16">
          <a href="/">
            <img
              className="w-48 sm:w-64 md:w-80 lg:w-96 "
              src="/logo.png"
              alt=""
            />
          </a>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center text-center sm:text-left">
            <div className="font-chakra-petch text-xl sm:text-2xl font-semibold tracking-wide text-foreground">
              Join our team
            </div>
            <div className="text-asymmetri-red text-sm sm:text-base font-medium">
              We&apos;re hiring
            </div>
          </div>
          <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl text-center px-4 text-sm sm:text-base text-muted-foreground leading-relaxed font-chakra-petch">
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
