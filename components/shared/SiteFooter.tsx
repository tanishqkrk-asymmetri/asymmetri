import { practices } from "@/lib/practices";
import { company } from "@/lib/site-content";

/** Footer link row used under the red CTA on every page. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={`flex flex-col gap-6 border-t border-white/25 px-6 py-6 font-chakra-petch text-xs text-white/80 md:px-10 ${className ?? ""}`}
    >
      <nav aria-label="What we do" className="flex flex-wrap justify-center gap-x-6 gap-y-1 md:justify-start">
        {practices.map((p) => (
          <a key={p.slug} href={p.href} className="hover:text-white">
            {p.name}
          </a>
        ))}
      </nav>
      <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-1">
          <a href="/about" className="hover:text-white">About</a>
          <a href="/case-studies" className="hover:text-white">Work</a>
          <a href="/careers" className="hover:text-white">Careers</a>
          <a href="/contact-us" className="hover:text-white">Contact</a>
          <a href={`mailto:${company.email}`} className="hover:text-white">
            {company.email}
          </a>
        </nav>
        <p>
          © {new Date().getFullYear()} Asymmetri. {company.tagline}
        </p>
      </div>
    </footer>
  );
}
