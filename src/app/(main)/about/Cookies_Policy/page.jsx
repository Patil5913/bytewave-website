"use client";

import React from "react";
import { motion } from "framer-motion";
import LegalLinks from "@/components/legal_links";

const CookiesPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <motion.div
        className="bg-gray-900 text-white py-40 px-4 sm:px-6 lg:px-8 rounded-b-[40px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-16 mt-12">
            Cookies Policy
          </motion.h1>

          <motion.p className="text-lg sm:text-xl max-w-3xl opacity-80 leading-relaxed">
            This Cookies Policy explains how Bytewave uses cookies and similar
            technologies to enhance your experience, analyze usage, and improve
            our services.
          </motion.p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 py-10 max-w-4xl mx-auto space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-black">
            1. What Are Cookies?
          </h2>
          <p className="mt-2">
            Cookies are small data files stored on your device when you visit a
            website. They help websites function efficiently, remember
            preferences, and collect information about user interactions.
          </p>
          <p className="mt-2">
            Cookies generally do not contain personally identifiable information
            but may be linked with information you provide separately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            2. Why We Use Cookies
          </h2>
          <p className="mt-2">We use cookies to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Ensure the website works properly</li>
            <li>Improve performance and user experience</li>
            <li>Analyze how visitors use our website</li>
            <li>Measure traffic and engagement</li>
          </ul>
          <p className="mt-2">
            We do not use cookies to sell your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            3. Types of Cookies We Use
          </h2>

          <p className="mt-2 font-medium">a) Essential Cookies</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Enable core website functionality</li>
            <li>Support secure sessions and form submissions</li>
            <li>Help prevent fraud or abuse</li>
          </ul>

          <p className="mt-4 font-medium">b) Analytics Cookies</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Track pages visited and time spent</li>
            <li>Understand user behavior and traffic sources</li>
            <li>Help improve website performance</li>
          </ul>
          <p className="mt-2">
            We may use tools like Google Analytics to collect aggregated,
            non-identifiable data.
          </p>

          <p className="mt-4 font-medium">c) Functional Cookies</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Remember your preferences</li>
            <li>Store form inputs and settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            4. Third-Party Cookies
          </h2>
          <p className="mt-2">
            Some cookies may be set by third-party services such as analytics or
            advertising providers. These third parties have their own privacy
            policies, and Bytewave does not control their behavior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            5. Managing Cookies
          </h2>
          <p className="mt-2">
            You can manage or disable cookies through your browser settings.
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>View stored cookies</li>
            <li>Delete existing cookies</li>
            <li>Block specific or all cookies</li>
          </ul>
          <p className="mt-2">
            Disabling cookies may impact website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">6. Do Not Track</h2>
          <p className="mt-2">
            Some browsers offer a "Do Not Track" feature. Currently, there is no
            standard for handling these signals, and we do not respond to them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            7. Updates to This Policy
          </h2>
          <p className="mt-2">
            We may update this Cookies Policy periodically to reflect changes in
            technology or legal requirements. Continued use of the website
            implies acceptance of updates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">8. Contact</h2>
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
      <LegalLinks current="cookies" />
    </div>
  );
};

export default CookiesPage;
