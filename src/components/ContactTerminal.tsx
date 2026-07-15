"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const TALENT_FIELDS = [
  { id: "name", label: "Full Name", type: "text", placeholder: "Jordan Lee" },
  { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
  { id: "role", label: "Target Role", type: "text", placeholder: "Backend Developer" },
  { id: "experience", label: "Years of Experience", type: "text", placeholder: "5" },
];

export default function ContactTerminal() {
  const fields = TALENT_FIELDS;

  return (
    <section className="w-full bg-black px-6 py-24 md:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mb-16 flex flex-col gap-4 md:max-w-2xl"
        >
          <span className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/50">
            <span className="text-emerald-400">[ 07 ]</span>
            Get In Touch
          </span>
          <h2 className="font-instrument text-4xl leading-tight font-medium text-white lg:text-5xl">
            Start your intake.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-white/50">
            Get verified and routed to companies actively hiring for your
            exact stack.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12"
        >
          {/* Context column */}
          <div className="flex flex-col gap-8 lg:col-span-4">
            <span className="flex w-fit items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white">
              Talent Intake
            </span>

            <div className="flex flex-col gap-4">
              <span className="text-xs tracking-widest text-white/40 uppercase">
                For Professionals
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-white/50">
                Get verified once and let direct-routed introductions come to
                you.
              </p>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-8">
            <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label
                    htmlFor={field.id}
                    className="text-xs font-medium tracking-widest text-white/50 uppercase"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label
                  htmlFor="message"
                  className="text-xs font-medium tracking-widest text-white/50 uppercase"
                >
                  Anything else we should know?
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Preferred remote/hybrid, notice period, etc."
                  className="w-full resize-none border-b border-white/15 bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="group mt-2 flex w-fit items-center justify-center gap-2 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur-md transition hover:bg-white/20 sm:col-span-2"
              >
                Apply for Verification
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
