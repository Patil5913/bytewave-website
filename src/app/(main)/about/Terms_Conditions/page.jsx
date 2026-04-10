"use client";

import React from "react";
import { motion } from "framer-motion";
import LegalLinks from "../_component/legal_links";

const TermsPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <motion.div
        className="bg-gray-900 text-white py-40 px-4 sm:px-6 lg:px-8 rounded-b-[40px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-16 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Terms & Conditions
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            These Terms & Conditions (“Terms”) govern your use of Bytewave’s
            website, services, and communications. By accessing or using our
            platform, you agree to follow these Terms.
          </motion.p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 py-10 max-w-4xl mx-auto space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-black">
            1. Acceptance of Terms
          </h2>
          <p className="mt-2">
            By accessing or using Bytewave's website, services, you acknowledge
            that you have read, understood, and agreed to be bound by these
            Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">2. Our Services</h2>
          <p className="mt-2">
            Bytewave provides career and staffing-related support services,
            including:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Job search assistance</li>
            <li>Resume and profile optimization</li>
            <li>Interview preparation guidance</li>
            <li>Career advisory and strategy support</li>
          </ul>

          <p className="mt-3">
            We do not guarantee job placement, interview calls, visa approvals,
            or employment outcomes. Success depends on individual
            qualifications, market demand, and employer decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            3. User Responsibilities
          </h2>
          <p className="mt-2">By using our services, you agree to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Provide accurate and truthful information</li>
            <li>Use the platform only for lawful purposes</li>
            <li>Not misuse, duplicate, or distribute proprietary materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            4. Intellectual Property
          </h2>
          <p className="mt-2">
            All materials, content, and frameworks provided by Bytewave are
            owned by the company. Unauthorized use, reproduction, or
            distribution is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            5. Payments & Refunds
          </h2>
          <p className="mt-2">
            Any paid services are subject to the terms communicated at the time
            of purchase. Refund eligibility, if applicable, will follow the
            stated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            6. Limitation of Liability
          </h2>
          <p className="mt-2">
            Bytewave is not responsible for decisions made by employers, visa
            authorities, or third parties.
          </p>
          <p className="mt-2">
            We are also not liable for indirect or consequential losses arising
            from the use of our services. Total liability, if any, is limited to
            the amount paid by the user.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            7. Third-Party Platforms
          </h2>
          <p className="mt-2">
            Our services may involve or link to third-party platforms. We do not
            control or take responsibility for their content, actions, or
            policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            8. Suspension or Termination
          </h2>
          <p className="mt-2">
            We reserve the right to restrict or terminate access to our services
            in case of misuse, violation of terms, or harmful activity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            9. Governing Law
          </h2>
          <p className="mt-2">
            These Terms shall be governed by applicable laws of the United
            States.div
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            10. Updates to Terms
          </h2>
          <p className="mt-2">
            We may update these Terms from time to time. Continued use of our
            services means you accept the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">11. Contact Us</h2>
          <p className="mt-2">
            For questions regarding these Terms, please contact:
            <br />
            <br />
            Bytewave
            <br />
            Email: info@bytewave.com
            <br />
            Phone:+1 (314) 464-5006
            <br />
            Website: https://www.bytewavetechnology.com
          </p>
        </section>
      </div>
        <LegalLinks current="terms" />
    </div>
  );
};

export default TermsPage;
