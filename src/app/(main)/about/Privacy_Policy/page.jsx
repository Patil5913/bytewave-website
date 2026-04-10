"use client";

import React from "react";
import { motion } from "framer-motion";
import LegalLinks from "../_component/legal_links";
const PrivacyPolicyPage = () => {
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
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Bytewave ("we", "our", "us") is committed to protecting your
            personal information. This Privacy Policy explains how we collect,
            use, and safeguard your data when you interact with our platform,
            services, or communication channels.
          </motion.p>
          <p className="mt-2">
            By using our services, you agree to the practices described in this
            policy.
          </p>
        </div>
      </motion.div>

      <div className="px-6 py-10 max-w-4xl mx-auto space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-black">
            1. Information We Collect
          </h2>
          <p className="mt-2 font-medium">a) Information You Provide</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Full name, email address, and phone number</li>
            <li>Resume, work experience, and career-related details</li>
            <li>Visa status or job preferences (if shared by you)</li>
          </ul>

          <p className="mt-4 font-medium">
            b) Automatically Collected Information
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>IP address and device information</li>
            <li>Browser type and usage behavior</li>
            <li>Pages visited and time spent on the website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            2. How We Use Your Information
          </h2>
          <p className="mt-2">We use your information to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Provide job search and staffing-related services</li>
            <li>Improve our platform and user experience</li>
            <li>Communicate updates, opportunities, and responses</li>
            <li>Ensure security and prevent misuse</li>
          </ul>
          <p className="mt-2">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            3. Cookies & Tracking
          </h2>
          <p className="mt-2">
            We use cookies and similar technologies to improve user experience,
            analyze traffic, and remember preferences.
          </p>
          <p className="mt-2">
            You can disable cookies through your browser settings, but some
            features may not function properly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">4. Data Sharing</h2>
          <p className="mt-2">We may share your information:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              With trusted service providers (hosting, communication tools)
            </li>
            <li>When required by law or legal processes</li>
            <li>During business transitions such as mergers or acquisitions</li>
          </ul>
          <p className="mt-2">
            We do not allow third parties to use your data for unrelated
            marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            5. Data Retention
          </h2>
          <p className="mt-2">
            We retain your data only as long as necessary for business, legal,
            or operational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            6. Data Security
          </h2>
          <p className="mt-2">
            We implement reasonable security measures to protect your
            information. However, no system is completely secure.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-black">7. Your Rights</h2>
          <p className="mt-2">You may have the right to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Request access to your data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent where applicable</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us using the details below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            8. Children's Privacy
          </h2>
          <p className="mt-2">
            Our services are not intended for individuals under the age of 16.
            We do not knowingly collect personal data from children.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-black">
            9. Updates to This Policy
          </h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Continued use
            of our services indicates acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">10. Contact Us</h2>
          <p className="mt-2">
            Bytewave
            <br />
            Email: info@bytewave.com
            <br />
            Phone: +1 (314) 464-5006
            <br />
            Website: https://www.bytewavetechnology.com
          </p>
        </section>
      </div>
      <LegalLinks current="privacy" />
    </div>
  );
};

export default PrivacyPolicyPage;
