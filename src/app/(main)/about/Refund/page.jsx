"use client";

import React from "react";
import { motion } from "framer-motion";
import LegalLinks from "../_component/legal_links";

const RefundPage = () => {
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
          >
            Refund Policy
          </motion.h1>

          <motion.p className="text-lg sm:text-xl max-w-3xl opacity-80 leading-relaxed">
            This policy explains when and how refunds may be issued for
            Bytewave’s career and staffing support services. By purchasing any
            service, you agree to the terms outlined below.
          </motion.p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 py-10 max-w-4xl mx-auto space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-black">
            1. Service Nature
          </h2>
          <p className="mt-2">
            Bytewave provides structured job search assistance including resume
            building, job applications, and interview preparation.
          </p>
          <p className="mt-2">
            We do not guarantee job placement, interview calls, or employment
            outcomes. Results depend on candidate effort, responsiveness, and
            market conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            2. Refund Eligibility (Timeline Based)
          </h2>
          <p className="mt-2">
            Refunds apply only to the upfront service fee and are calculated
            based on the number of days since onboarding.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border border-gray-200 text-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 border-b">Time from Start</th>
                  <th className="text-left p-3 border-b">Refund</th>
                  <th className="text-left p-3 border-b">Charged</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b">0 – 30 Days</td>
                  <td className="p-3 border-b">100%</td>
                  <td className="p-3 border-b">0%</td>
                </tr>
                <tr>
                  <td className="p-3 border-b">31 – 60 Days</td>
                  <td className="p-3 border-b">80%</td>
                  <td className="p-3 border-b">20%</td>
                </tr>
                <tr>
                  <td className="p-3 border-b">61 – 90 Days</td>
                  <td className="p-3 border-b">20%</td>
                  <td className="p-3 border-b">80%</td>
                </tr>
                <tr>
                  <td className="p-3">After 90 Days</td>
                  <td className="p-3">0%</td>
                  <td className="p-3">100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm font-medium text-red-600">
            After 45 days, payments are non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            3. Interview-Based Plans (If Applicable)
          </h2>
          <p className="mt-2">
            If your plan includes a defined number of interview opportunities:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              No refund is applicable once the full interview count is reached
            </li>
            <li>
              Partial refunds may be issued if fewer interviews are delivered
            </li>
          </ul>

          <p className="mt-2">
            Refunds will be calculated proportionally based on the shortfall.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            4. Job Offer Clause
          </h2>
          <p className="mt-2">
            If a candidate secures employment during the service period, the
            service is considered fulfilled and no refund will be issued.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            5. Inactivity & Non-Compliance
          </h2>
          <p className="mt-2">Refunds are not applicable if the candidate:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Fails to respond to communication</li>
            <li>Misses or avoids interviews</li>
            <li>Does not provide required information</li>
            <li>Shows repeated delays or lack of cooperation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            6. Refund Processing
          </h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Refunds are processed within 7–14 business days</li>
            <li>Refunds are issued via the original payment method</li>
            <li>Transaction or processing fees are non-refundable</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            7. Non-Refundable Situations
          </h2>
          <p className="mt-2">Refunds will not be issued due to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Market conditions or hiring slowdowns</li>
            <li>Visa or immigration changes</li>
            <li>Personal decisions by the candidate</li>
            <li>Voluntary withdrawal from the program</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">
            8. Final Decision Authority
          </h2>
          <p className="mt-2">
            Bytewave reserves the right to make the final decision on refund
            eligibility based on internal records, communication logs, and
            service activity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">9. Contact</h2>
          <p className="mt-2">
            For refund-related queries, contact:
            <br />
            <br />
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
      <LegalLinks current="refund" />
    </div>
  );
};

export default RefundPage;
