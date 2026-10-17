"use client";

import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Activity,
  ClipboardList,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  FileHeart,
  Clock3,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    number: "01",
    title: "A complete medical history",
    description:
      "Bring medical visits, allergies, medications, and important health information together in one organized profile.",
    icon: FileHeart,
    tag: "CONNECTED RECORDS",
  },
  {
    number: "02",
    title: "Emergency identification",
    description:
      "Explore a simulated identification workflow designed to make critical patient information easier to locate.",
    icon: HeartPulse,
    tag: "EMERGENCY READINESS",
  },
  {
    number: "03",
    title: "AI-assisted summaries",
    description:
      "Discover how concise summaries could help care teams review relevant medical history more efficiently.",
    icon: Sparkles,
    tag: "INTELLIGENT ACCESS",
  },
];

const steps = [
  {
    number: "01",
    title: "Bring records together",
    description:
      "Organize medical encounters, medications, allergies, and important documents within a structured patient profile.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Locate critical details",
    description:
      "Explore a simulated emergency workflow that brings relevant patient information into view for authorized review.",
    icon: Activity,
  },
  {
    number: "03",
    title: "Review with clarity",
    description:
      "See how structured records and concise summaries could support healthcare professionals in reviewing patient history.",
    icon: Stethoscope,
  },
];

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToDashboard = () => {
    setMobileMenuOpen(false);
    router.push("/dashboard");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4faf9] text-[#102b29]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#d9e9e6]/70 bg-[#f4faf9]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-14">
          <a href="#" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1a7a6e] text-white shadow-[0_6px_18px_rgba(26,122,110,0.2)] transition group-hover:-rotate-3">
              <HeartPulse size={23} strokeWidth={1.8} />
            </span>

            <span>
              <span className="block text-[19px] font-bold tracking-[-0.055em] text-[#102b29]">
                CHIKITSALYA
              </span>
              <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.2em] text-[#718985]">
                CONNECTED CARE
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {[
              ["Features", "#features"],
              ["How it works", "#how-it-works"],
              ["Our vision", "#about"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-[13px] font-medium text-[#58716d] transition-colors hover:text-[#1a7a6e]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <span className="flex items-center gap-2 text-[11px] font-medium text-[#718985]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2a9d8f]" />
              Interactive prototype
            </span>
            <button
              onClick={goToDashboard}
              className="group inline-flex items-center gap-2 rounded-full bg-[#1a7a6e] px-5 py-3 text-[12px] font-semibold text-white shadow-[0_5px_16px_rgba(26,122,110,0.14)] transition hover:-translate-y-0.5 hover:bg-[#14665b]"
            >
              Explore demo
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9e9e6] bg-white text-[#1a7a6e] md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#d9e9e6] bg-[#f8fcfb] px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-1">
              {[
                ["Features", "#features"],
                ["How it works", "#how-it-works"],
                ["Our vision", "#about"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={closeMobileMenu}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-[#3a5c58] hover:bg-[#e8f4f2]"
                >
                  {label}
                </a>
              ))}
              <button
                onClick={goToDashboard}
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#1a7a6e] px-5 py-3.5 text-sm font-semibold text-white"
              >
                Explore demo <ArrowRight size={16} />
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute -right-40 top-8 -z-10 h-[500px] w-[500px] rounded-full bg-[#d7eee8]/65 blur-[100px]" />
        <div className="pointer-events-none absolute -left-48 top-64 -z-10 h-[350px] w-[350px] rounded-full bg-[#e1eeeb]/70 blur-[90px]" />

        <div className="mx-auto grid max-w-[1380px] items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-14 lg:pb-28 lg:pt-24">
          <div className="animate-fade-up relative z-10">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#cfe6df] bg-white/80 px-3.5 py-2 text-[10px] font-semibold tracking-[0.09em] text-[#34786e] shadow-sm sm:text-[11px]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e0f2ec]">
                <Activity size={12} />
              </span>
              A NEW PERSPECTIVE ON CONNECTED CARE
            </div>

            <h1 className="max-w-[650px] text-[46px] font-semibold leading-[1.08] tracking-[-0.065em] text-[#102b29] sm:text-6xl lg:text-[76px]">
              Every detail matters.
              <span className="font-display mt-2 block font-medium italic tracking-[-0.055em] text-[#1a7a6e]">
                Especially when
                <br className="hidden sm:block" /> it matters most.
              </span>
            </h1>

            <p className="mt-7 max-w-[520px] text-[15px] leading-[1.95] text-[#58716d] sm:text-base">
              Medical histories, critical health information, and a clearer
              view of the patient—all brought together in one thoughtfully
              designed healthcare experience.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={goToDashboard}
                className="group inline-flex items-center gap-3 rounded-full bg-[#1a7a6e] px-6 py-4 text-[13px] font-semibold text-white shadow-[0_8px_22px_rgba(26,122,110,0.18)] transition hover:-translate-y-1 hover:bg-[#14665b]"
              >
                Explore the demo
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-[#d3e4df] bg-white/65 px-5 py-4 text-[13px] font-semibold text-[#315650] transition hover:border-[#9bcfc2] hover:bg-white"
              >
                Discover the concept
                <ArrowDown size={14} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#d9e9e6] pt-6 text-[11px] font-medium text-[#718985]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#2a9d8f]" />
                Privacy-conscious design
              </span>
              <span className="flex items-center gap-2">
                <ClipboardList size={15} className="text-[#2a9d8f]" />
                Fictional demo records
              </span>
            </div>
          </div>

          {/* Medical dashboard preview */}
          <div className="animate-fade-up relative mx-auto w-full max-w-[610px] [animation-delay:150ms]">
            <div className="absolute -right-6 top-4 h-36 w-36 rounded-full bg-[#bce6dc]/70 blur-[70px]" />
            <div className="absolute -bottom-8 left-0 h-40 w-40 rounded-full bg-[#c9e5e0]/80 blur-[75px]" />

            <div className="glass-panel relative rounded-[28px] p-4 sm:rounded-[34px] sm:p-6">
              {/* Preview header */}
              <div className="flex items-center justify-between border-b border-[#e3efec] pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2f2ed] text-[#1a7a6e]">
                    <HeartPulse size={21} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold tracking-tight text-[#102b29]">
                      Patient overview
                    </p>
                    <p className="mt-1 text-[10px] text-[#718985]">
                      Medical record workspace
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 rounded-full border border-[#d4eae1] bg-[#f0faf5] px-2.5 py-1.5 text-[9px] font-semibold text-[#34786e] sm:px-3 sm:text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2a9d8f]" />
                  DEMO MODE
                </span>
              </div>

              {/* Patient profile */}
              <div className="mt-6 flex items-center gap-3.5 sm:gap-4">
                <div className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[19px] bg-[#dcefe9] text-lg font-bold text-[#1a7a6e] sm:h-[66px] sm:w-[66px] sm:text-xl">
                  AM
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#2a9d8f] text-white">
                    <ShieldCheck size={11} />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold tracking-tight text-[#102b29] sm:text-lg">
                    Alex Morgan
                  </p>
                  <p className="mt-1 text-[11px] text-[#718985]">
                    Patient ID · MN-20481
                  </p>
                  <p className="mt-1 text-[10px] text-[#8ba19c]">
                    Fictional patient profile
                  </p>
                </div>

                <div className="hidden rounded-2xl border border-[#e3efec] bg-white p-3 text-[#1a7a6e] sm:block">
                  <FileHeart size={22} strokeWidth={1.6} />
                </div>
              </div>

              {/* Summary cards */}
              <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  {
                    label: "Encounters",
                    value: "08",
                    icon: ClipboardList,
                  },
                  {
                    label: "Medications",
                    value: "03",
                    icon: Activity,
                  },
                  {
                    label: "Documents",
                    value: "12",
                    icon: FileHeart,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-[#e5efec] bg-white/85 p-3 sm:p-4"
                    >
                      <Icon
                        size={15}
                        className="mb-3 text-[#6b9e94] sm:mb-4"
                      />
                      <p className="text-xl font-semibold tracking-tight text-[#102b29] sm:text-2xl">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[9px] text-[#718985] sm:text-[11px]">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Critical information */}
              <div className="mt-4 rounded-2xl border border-[#dcebe6] bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5f0] text-[#1a7a6e]">
                      <HeartPulse size={19} />
                    </span>
                    <div>
                      <p className="text-[12px] font-bold text-[#173d37] sm:text-[13px]">
                        Critical health information
                      </p>
                      <p className="mt-1 text-[10px] text-[#8ba19c]">
                        Illustrative record preview
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight size={17} className="text-[#8ba19c]" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Medical history", "Allergies", "Medications"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-lg bg-[#f0f7f5] px-3 py-2 text-[10px] font-medium text-[#52756e]"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Summary preview */}
              <div className="mt-4 rounded-2xl border border-[#d8ebe4] bg-[#eef8f4] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1a7a6e] shadow-sm">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[12px] font-bold text-[#1b5147]">
                        AI-assisted summary concept
                      </p>
                      <span className="rounded-full bg-[#d9eee5] px-2 py-1 text-[8px] font-semibold text-[#34786e]">
                        PREVIEW
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] leading-[1.8] text-[#58716d]">
                      A future-facing concept for reviewing relevant health
                      history in a concise, structured format. This preview
                      is illustrative and does not generate clinical advice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-[#8ba19c]">
                <ShieldCheck size={12} />
                Illustrative interface · No real patient data
              </div>
            </div>

            {/* Floating labels */}
            <div className="animate-float absolute -left-3 top-[24%] hidden items-center gap-2.5 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-[0_12px_35px_rgba(21,77,69,0.1)] sm:flex lg:-left-10">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5f5ef] text-[#1a7a6e]">
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="text-[10px] font-bold text-[#173d37]">
                  Privacy in focus
                </p>
                <p className="mt-1 text-[9px] text-[#718985]">
                  Designed with care
                </p>
              </div>
            </div>

            <div className="animate-float absolute -right-2 bottom-[15%] hidden items-center gap-2.5 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-[0_12px_35px_rgba(21,77,69,0.1)] sm:flex lg:-right-8 [animation-delay:900ms]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3fc] text-[#5478a9]">
                <Clock3 size={18} />
              </span>
              <div>
                <p className="text-[10px] font-bold text-[#173d37]">
                  Information, organized
                </p>
                <p className="mt-1 text-[9px] text-[#718985]">
                  A clearer patient view
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#cde2dc] to-transparent" />
      </section>

      {/* Trust / value strip */}
      <section className="border-b border-[#e3efec] bg-[#fbfdfc]">
        <div className="mx-auto grid max-w-[1380px] gap-7 px-5 py-9 sm:grid-cols-3 sm:px-8 lg:px-14">
          {[
            {
              icon: ClipboardList,
              title: "One connected view",
              description:
                "A structured way to explore a patient's medical history.",
            },
            {
              icon: HeartPulse,
              title: "Emergency-focused",
              description:
                "A concept built around finding important details quickly.",
            },
            {
              icon: ShieldCheck,
              title: "Privacy-conscious",
              description:
                "Thoughtful access and accountability design principles.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex items-start gap-4 ${
                  index > 0
                    ? "sm:border-l sm:border-[#e3efec] sm:pl-7 lg:pl-10"
                    : ""
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f4f0] text-[#1a7a6e]">
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <div>
                  <h2 className="text-[13px] font-bold text-[#173d37]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 max-w-[270px] text-[11px] leading-[1.8] text-[#718985]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 bg-[#e8f4f2] py-20 sm:py-28">
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-14">
          <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#1a7a6e]">
                <span className="h-px w-7 bg-[#2a9d8f]" />
                THOUGHTFULLY CONNECTED
              </span>
              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.15] tracking-[-0.055em] text-[#102b29] sm:text-5xl">
                The right information.
                <span className="font-display mt-1 block font-medium italic text-[#1a7a6e]">
                  A clearer picture.
                </span>
              </h2>
            </div>

            <p className="max-w-lg text-[13px] leading-[2] text-[#58716d] lg:justify-self-end lg:pb-2">
              CHIKITSALYA explores a more connected way to organize medical
              records and critical information. Each feature is designed
              around accessibility, clarity, and responsible healthcare
              technology.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group relative overflow-hidden rounded-[26px] border border-[#d6e8e2] bg-[#f9fcfb] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[#a8d3c7] hover:shadow-[0_22px_45px_rgba(21,77,69,0.09)] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1f1eb] text-[#1a7a6e] transition duration-300 group-hover:bg-[#1a7a6e] group-hover:text-white">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <span className="text-[11px] font-semibold tracking-[0.15em] text-[#9ab5ae]">
                      {feature.number}
                    </span>
                  </div>

                  <p className="mt-8 text-[9px] font-bold tracking-[0.17em] text-[#6a9b90]">
                    {feature.tag}
                  </p>
                  <h3 className="mt-3 text-[21px] font-semibold leading-snug tracking-[-0.04em] text-[#173d37]">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-[12px] leading-[2] text-[#718985]">
                    {feature.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-[#e3efec] pt-5">
                    <span className="text-[10px] font-medium text-[#718985]">
                      Designed around people
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-[#1a7a6e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>

                  <div className="pointer-events-none absolute -bottom-14 -right-14 h-32 w-32 rounded-full bg-[#dff0ee] opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-[#f8fcfb] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#1a7a6e]">
                <span className="h-px w-7 bg-[#2a9d8f]" />
                HOW IT WORKS
              </span>

              <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.16] tracking-[-0.055em] text-[#102b29] sm:text-5xl">
                From scattered records
                <span className="font-display mt-1 block font-medium italic text-[#1a7a6e]">
                  to a clearer story.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-[13px] leading-[2] text-[#58716d]">
                A simple concept for bringing important health information
                together, while keeping healthcare professionals responsible
                for clinical decisions.
              </p>

              <button
                onClick={goToDashboard}
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[#cfe3dc] bg-white px-5 py-3.5 text-[12px] font-semibold text-[#1a7a6e] transition hover:border-[#9bcfc2] hover:bg-[#edf7f3]"
              >
                Explore the workflow
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            <div className="relative">
              <div className="absolute bottom-10 left-[25px] top-10 w-px bg-[#d6e8e2] sm:left-[31px]" />

              <div className="space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <article
                      key={step.number}
                      className="group relative flex gap-5 rounded-[24px] border border-[#e2efeb] bg-white p-5 transition duration-300 hover:border-[#c4e1d7] hover:shadow-[0_12px_35px_rgba(21,77,69,0.06)] sm:gap-6 sm:p-7"
                    >
                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d6e8e2] bg-[#f0f8f5] text-[#1a7a6e] transition group-hover:border-[#1a7a6e] group-hover:bg-[#1a7a6e] group-hover:text-white sm:h-[62px] sm:w-[62px]">
                        <Icon size={23} strokeWidth={1.6} />
                      </div>

                      <div className="min-w-0 flex-1 pt-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[9px] font-bold tracking-[0.15em] text-[#6a9b90]">
                            STEP {step.number}
                          </span>
                        </div>
                        <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.025em] text-[#173d37] sm:text-xl">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[11px] leading-[1.9] text-[#718985] sm:text-[12px]">
                          {step.description}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="mt-1 hidden shrink-0 text-[#a0bcb4] transition group-hover:text-[#1a7a6e] sm:block"
                      />
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / CTA */}
      <section id="about" className="scroll-mt-24 bg-[#f8fcfb] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-14">
        <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[30px] bg-[#123d36] px-6 py-12 sm:rounded-[38px] sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-8 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-36 left-[35%] h-72 w-72 rounded-full bg-[#2a9d8f]/20 blur-[90px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-[9px] font-semibold tracking-[0.18em] text-[#a5d8ca]">
                <Sparkles size={13} />
                THE CHIKITSALYA VISION
              </span>

              <h2 className="mt-6 text-3xl font-semibold leading-[1.15] tracking-[-0.05em] text-white sm:text-5xl">
                Better access to information.
                <span className="font-display mt-2 block font-medium italic text-[#88d0bd]">
                  More room for care.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[12px] leading-[2] text-[#c0d8d1] sm:text-[13px]">
                We&apos;re exploring how connected health records and
                responsible technology could help make critical information
                easier to access when people need care.
              </p>
            </div>

            <button
              onClick={goToDashboard}
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#d7f0e8] px-6 py-4 text-[12px] font-bold text-[#164d43] transition hover:-translate-y-1 hover:bg-white"
            >
              Explore the prototype
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#dcebe6] bg-[#f4faf9]">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-7 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-14">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a7a6e] text-white">
              <HeartPulse size={21} />
            </span>
            <span>
              <span className="block text-[15px] font-bold tracking-tight text-[#102b29]">
                CHIKITSALYA
              </span>
              <span className="mt-1 block text-[9px] font-medium tracking-[0.13em] text-[#718985]">
                CONNECTED CARE, THOUGHTFULLY DESIGNED
              </span>
            </span>
          </a>

          <div className="max-w-xl text-[10px] leading-[1.9] text-[#718985] md:text-right">
            <p>
              Prototype for demonstration and educational purposes only.
              Uses fictional records and simulated identification.
            </p>
            <p className="mt-1">
              Not a medical device, clinical decision system, or emergency
              service.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

