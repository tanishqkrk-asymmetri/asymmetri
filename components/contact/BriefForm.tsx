"use client";

import { useEffect, useId, useMemo, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { company } from "@/lib/site-content";
import {
  formCopy,
  intents,
  practiceOptions,
  stageOptions,
  type IntentId,
} from "./content";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TICKS = 20;
const THRESHOLDS = [0, 0.3, 0.6, 0.9];

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const pad = (n: number) => String(n).padStart(2, "0");

/** How complete the brief is, 0 to 1. Drives the meter and the SignalField. */
function completeness(f: {
  name: string;
  email: string;
  company: string;
  message: string;
  practices: string[];
  stage: string | null;
}) {
  let v = 0.05; // an intent is always chosen
  if (f.name.trim().length > 1) v += 0.15;
  if (EMAIL_RE.test(f.email.trim())) v += 0.2;
  else if (f.email.includes("@")) v += 0.07;
  if (f.company.trim()) v += 0.05;
  if (f.practices.length) v += 0.1;
  if (f.stage) v += 0.1;
  v += Math.min(f.message.trim().length / 140, 1) * 0.35;
  return Math.min(v, 1);
}

function Chip({
  type,
  name,
  value,
  checked,
  onChange,
  children,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="flex items-center gap-2 border border-white/20 bg-black/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 transition-[background-color,border-color,color] duration-200 select-none peer-checked:border-asymmetri-red peer-checked:bg-asymmetri-red peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white hover:border-white/60 hover:text-white">
        {type === "checkbox" && (
          <span
            aria-hidden
            className={`relative inline-block size-2 border ${checked ? "border-white bg-white" : "border-white/50"}`}
          />
        )}
        {children}
      </span>
    </label>
  );
}

function Field({
  n,
  id,
  label,
  error,
  children,
}: {
  n: number;
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="group/f relative">
      <label
        htmlFor={id}
        className="mb-1.5 flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 transition-colors group-focus-within/f:text-white"
      >
        <span className="text-asymmetri-red">{pad(n)}</span>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ff5a5a]">
          ✕ {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full select-text border-0 border-b border-white/25 bg-transparent pb-2 font-geist text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-asymmetri-red aria-[invalid=true]:border-[#ff5a5a]";

function SignalMeter({ value }: { value: number }) {
  const filled = Math.round(value * TICKS);
  let level = 0;
  THRESHOLDS.forEach((t, i) => {
    if (value >= t) level = i;
  });
  return (
    <div className="flex items-center gap-3" aria-label={`Signal: ${formCopy.signalLabels[level]}`}>
      <div className="flex h-3 items-end gap-[2px]" aria-hidden>
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            key={i}
            style={{ height: `${35 + (i / TICKS) * 65}%` }}
            className={`w-[3px] transition-colors duration-300 ${i < filled ? (value >= 0.9 ? "bg-asymmetri-red" : "bg-white") : "bg-white/15"}`}
          />
        ))}
      </div>
      <span
        className={`w-[4.5rem] font-mono text-[10px] uppercase tracking-[0.22em] ${level === 3 ? "text-asymmetri-red" : "text-white/70"}`}
      >
        {formCopy.signalLabels[level]}
      </span>
    </div>
  );
}

/**
 * The contact brief. Writes to Firestore ("enquiries"); if that fails it
 * falls back to the visitor's email app with the brief filled in.
 */
export function BriefForm({
  clarityRef,
  onSent,
}: {
  clarityRef: RefObject<number>;
  onSent: () => void;
}) {
  const uid = useId();
  const [intent, setIntent] = useState<IntentId>("project");
  const [practices, setPractices] = useState<string[]>([]);
  const [stage, setStage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [ref, setRef] = useState("");
  const [mailto, setMailto] = useState("");

  const value = useMemo(
    () => completeness({ name, email, company: org, message, practices, stage }),
    [name, email, org, message, practices, stage],
  );

  useEffect(() => {
    clarityRef.current = status === "sent" ? 1 : value;
  }, [value, status, clarityRef]);

  const clearError = (k: keyof Errors) =>
    setErrors((cur) => {
      if (!cur[k]) return cur;
      const next = { ...cur };
      delete next[k];
      return next;
    });

  const togglePractice = (id: string) =>
    setPractices((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Tell us who you are";
    if (!EMAIL_RE.test(email.trim())) e.email = "We need a valid email to reply";
    if (message.trim().length < 10) e.message = "A sentence or two about the problem";
    return e;
  };

  const buildMailto = () => {
    const intentLabel = intents.find((i) => i.id === intent)?.label ?? intent;
    const practiceLabels = practices
      .map((p) => practiceOptions.find((o) => o.id === p)?.label ?? p)
      .join(", ");
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      org ? `Company: ${org}` : null,
      `Bringing: ${intentLabel}`,
      practiceLabels ? `Practice: ${practiceLabels}` : null,
      stage ? `Stage: ${stage}` : null,
      "",
      message,
    ]
      .filter((l): l is string => l !== null)
      .join("\n");
    return `mailto:${company.email}?subject=${encodeURIComponent(`Brief: ${intentLabel}${org ? ` · ${org}` : ""}`)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = (["name", "email", "message"] as const).find((k) => errs[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const id = crypto.randomUUID();
    setRef(id.slice(0, 8).toUpperCase());

    // Bots fill every field; quietly pretend it worked.
    if (website) {
      setStatus("sent");
      onSent();
      return;
    }

    setStatus("sending");
    try {
      const write = setDoc(doc(db, "enquiries", id), {
        id,
        name: name.trim(),
        email: email.trim(),
        company: org.trim(),
        message: message.trim(),
        intent,
        practices,
        stage,
        createdAt: serverTimestamp(),
        timestamp: Date.now(),
        source: "contact-us",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      });
      // An offline client would wait forever for the server; give up after 12s.
      await Promise.race([
        write,
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 12000)),
      ]);
      setStatus("sent");
      onSent();
    } catch {
      const link = buildMailto();
      setMailto(link);
      setStatus("error");
      window.location.href = link;
    }
  };

  const reset = () => {
    setPractices([]);
    setStage(null);
    setMessage("");
    setErrors({});
    setStatus("idle");
    setIntent("project");
  };

  const nowIst = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());

  return (
    <div className="relative border border-white/15 bg-black/70 backdrop-blur-md">
      {/* Corner ticks */}
      <span aria-hidden className="absolute -top-px -left-px size-3 border-t-2 border-l-2 border-asymmetri-red" />
      <span aria-hidden className="absolute -right-px -bottom-px size-3 border-r-2 border-b-2 border-asymmetri-red" />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-5 py-3 md:px-7">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white">
          <span className="kit-blink inline-block size-1.5 bg-asymmetri-red" aria-hidden />
          {formCopy.kicker}
        </p>
        <SignalMeter value={status === "sent" ? 1 : value} />
      </div>

      <div aria-live="polite" className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="flex min-h-[28rem] flex-col justify-between gap-10 p-5 md:p-7"
            >
              <div className="space-y-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-asymmetri-red">
                  Transmission complete
                </p>
                <p className="font-chakra-petch text-4xl leading-[0.95] font-bold uppercase md:text-6xl">
                  {formCopy.successTitle}
                </p>
                <p className="max-w-md font-geist text-base leading-relaxed text-white/75">
                  {formCopy.successBody(name, email)}
                </p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <dl className="grid grid-cols-2 gap-x-8 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  <dt>Ref</dt>
                  <dd className="text-white">{ref}</dd>
                  <dt>Logged</dt>
                  <dd className="text-white">{nowIst()} IST</dd>
                </dl>
                <button
                  type="button"
                  onClick={reset}
                  className="cursor-pointer border border-white/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Send another brief
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              noValidate
              onSubmit={onSubmit}
              initial={false}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.4 } }}
              className="space-y-7 p-5 md:p-7"
              aria-label="Send Asymmetri a brief"
            >
              <fieldset>
                <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                  {formCopy.intentLabel}
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {intents.map((i) => (
                    <Chip
                      key={i.id}
                      type="radio"
                      name="intent"
                      value={i.id}
                      checked={intent === i.id}
                      onChange={() => setIntent(i.id)}
                    >
                      {i.label}
                    </Chip>
                  ))}
                </div>
                <p className="mt-2.5 min-h-[1.25rem] font-geist text-sm text-white/55">
                  {intent === "careers" ? (
                    <>
                      Joining the crew? Applications go through{" "}
                      <a href="/careers" className="text-white underline decoration-asymmetri-red underline-offset-4 hover:text-asymmetri-red">
                        Careers &amp; Culture →
                      </a>
                    </>
                  ) : (
                    intents.find((i) => i.id === intent)?.hint
                  )}
                </p>
              </fieldset>

              {intent !== "careers" && (
                <>
                  <fieldset>
                    <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                      {formCopy.practiceLabel}
                    </legend>
                    <div className="flex flex-wrap gap-1.5">
                      {practiceOptions.map((p) => (
                        <Chip
                          key={p.id}
                          type="checkbox"
                          name="practices"
                          value={p.id}
                          checked={practices.includes(p.id)}
                          onChange={() => togglePractice(p.id)}
                        >
                          {p.label}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                      {formCopy.stageLabel}
                    </legend>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {stageOptions.map((s, i) => (
                        <span key={s} className="flex items-center gap-1.5">
                          {i > 0 && <span aria-hidden className="hidden h-px w-2 bg-white/25 sm:inline-block" />}
                          <Chip
                            type="radio"
                            name="stage"
                            value={s}
                            checked={stage === s}
                            onChange={() => setStage(s)}
                          >
                            {s}
                          </Chip>
                        </span>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <Field n={1} id={`${uid}-name`} label={formCopy.name} error={errors.name}>
                  <input
                    id={`${uid}-name`}
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                    className={inputCls}
                  />
                </Field>
                <Field n={2} id={`${uid}-email`} label={formCopy.email} error={errors.email}>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field n={3} id={`${uid}-company`} label={formCopy.company}>
                <input
                  id={`${uid}-company`}
                  name="company"
                  autoComplete="organization"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field n={4} id={`${uid}-message`} label={formCopy.message} error={errors.message}>
                <textarea
                  id={`${uid}-message`}
                  name="message"
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearError("message");
                  }}
                  placeholder={formCopy.messagePlaceholder}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? `${uid}-message-error` : undefined}
                  className={`${inputCls} min-h-[5.5rem] resize-y`}
                />
              </Field>

              {/* Honeypot: hidden from people and assistive tech. */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${uid}-website`}>Website</label>
                <input
                  id={`${uid}-website`}
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {status === "error" && (
                <p role="alert" className="border-l-2 border-asymmetri-red pl-3 font-geist text-sm leading-relaxed text-white/80">
                  {formCopy.errorBody}{" "}
                  <a href={mailto || `mailto:${company.email}`} className="text-white underline decoration-asymmetri-red underline-offset-4">
                    {company.email}
                  </a>
                </p>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group relative flex w-full cursor-pointer items-center justify-between gap-6 overflow-hidden bg-asymmetri-red px-5 py-4 font-chakra-petch text-base font-bold uppercase tracking-wide text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait md:text-lg"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-1/4 w-[150%] origin-left -skew-x-[26deg] scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                  <span className="relative transition-colors duration-300 group-hover:text-asymmetri-red">
                    {status === "sending" ? (
                      <>
                        {formCopy.sending}
                        <span className="kit-blink ml-1">_</span>
                      </>
                    ) : (
                      formCopy.submit
                    )}
                  </span>
                  <span className="relative font-mono text-sm transition-colors duration-300 group-hover:text-asymmetri-red">
                    ↗
                  </span>
                </button>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {formCopy.privacy}
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
