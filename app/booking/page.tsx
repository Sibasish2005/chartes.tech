"use client";

import { useState, FormEvent } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Clock,
  Video,
  CheckCircle2,
  Shield,
  Send,
} from "lucide-react";

const meetingTypes = [
  {
    id: "strategy",
    title: "30-Min Social Growth Strategy",
    duration: "30 mins",
    type: "Google Meet / Zoom",
    badge: "Popular",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description:
      "Deep dive into your current distribution bottlenecks, platform hooks, and tailored strategy.",
  },
  {
    id: "automation",
    title: "Enterprise Automation Onboarding",
    duration: "45 mins",
    type: "Technical Discovery",
    badge: "For Teams",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description:
      "Custom integration setup for multi-account publishing, API limits, and team workflows.",
  },
  {
    id: "audit",
    title: "Creative & Content Funnel Audit",
    duration: "30 mins",
    type: "Creative Review",
    badge: "Creators",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description:
      "Actionable critique of your visual carousels, caption copywriting, and short-form video retention.",
  },
];

const timeSlots = [
  "09:30 AM",
  "11:00 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
];

export default function BookingPage() {
  const [selectedMeeting, setSelectedMeeting] = useState("strategy");
  const [selectedTime, setSelectedTime] = useState("02:00 PM");
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  }

  const currentMeeting =
    meetingTypes.find((m) => m.id === selectedMeeting) || meetingTypes[0];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header Hero */}
        <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 lg:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Book a Strategy Call
            </h1>
            <p className="text-neutral-500 text-xs lg:text-sm max-w-xl">
              Schedule a 1-on-1 discovery session with our social growth and automation team.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-[#EAE3D9] shadow-xs self-start md:self-auto">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Free Consultation</span>
          </div>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-[#EAE3D9] p-10 lg:p-14 text-center space-y-5 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h2 className="text-xl font-bold text-neutral-900">
                Call Scheduled Successfully!
              </h2>
              <p className="text-neutral-600 text-xs leading-relaxed">
                Thank you, <span className="font-semibold text-neutral-900">{fullName || "there"}</span>. A calendar invitation and Google Meet link have been sent to{" "}
                <span className="font-semibold text-neutral-900">{email || "your email"}</span> for{" "}
                <span className="font-semibold text-neutral-900">
                  {selectedDate} at {selectedTime}
                </span>.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFullName("");
                  setEmail("");
                  setNotes("");
                }}
                className="px-5 py-2.5 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs"
              >
                Schedule Another Call
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Call Type Selection */}
            <div className="lg:col-span-5 space-y-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-1">
                1. Select Consultation Type
              </p>

              <div className="space-y-2.5">
                {meetingTypes.map((item) => {
                  const isSelected = selectedMeeting === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedMeeting(item.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2.5 ${
                        isSelected
                          ? "bg-white border-black shadow-xs ring-1 ring-black"
                          : "bg-white/80 border-[#EAE3D9] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-neutral-900">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Highlights Card */}
              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D9] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                  <Video className="w-3.5 h-3.5 text-neutral-600" />
                  <span>What to expect on the call</span>
                </div>
                <ul className="text-[11px] text-neutral-500 space-y-0.5 list-disc list-inside">
                  <li>Direct audit of your target social channels</li>
                  <li>Live walkthrough of the automated scheduler</li>
                  <li>Tailored content strategy framework</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Time Selection & Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE3D9] p-5 lg:p-7 shadow-xs space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                    2. Choose Date & Time
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-xs font-medium focus:bg-white focus:ring-1 focus:ring-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Time Slot
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {timeSlots.map((slot) => {
                          const isSlotActive = selectedTime === slot;
                          return (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-1.5 px-1 text-[10px] font-medium rounded-lg border transition-all text-center ${
                                isSlotActive
                                  ? "bg-[#18181B] text-white border-black shadow-xs font-semibold"
                                  : "bg-[#FAF8F5] text-neutral-600 border-[#EAE3D9] hover:bg-white"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE3D9]/60 space-y-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    3. Contact Information
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sarah Jenkins"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-xs focus:bg-white focus:ring-1 focus:ring-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-xs focus:bg-white focus:ring-1 focus:ring-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 block mb-1">
                      Company / Brand URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://yourbrand.com or LinkedIn URL"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-xs focus:bg-white focus:ring-1 focus:ring-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 block mb-1">
                      Goals & Questions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Scaling LinkedIn content and automated multi-channel distribution..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-xs focus:bg-white focus:ring-1 focus:ring-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>
                      {submitting
                        ? "Booking Call..."
                        : `Confirm ${currentMeeting.duration} Strategy Call`}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
