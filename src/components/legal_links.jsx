"use client";

import Link from "next/link";

const policies = [
  {
    key: "terms",
    label: "Terms & Conditions",
    href: "/about/Terms_Conditions",
  },
  { key: "refund", label: "Refund Policy", href: "/about/Refund" },
  { key: "privacy", label: "Privacy Policy", href: "/about/Privacy_Policy" },
  { key: "cookies", label: "Cookies Policy", href: "/about/Cookies_Policy" },
];

export default function LegalLinks({ current }) {
  const filtered = policies.filter((p) => p.key !== current);

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-t-2xl border border-gray-200 flex flex-col items-center text-center">
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
        Finished reading this policy? You may also review our{" "}
        {filtered.map((policy, index) => (
          <span key={policy.key}>
            <Link
              href={policy.href}
              className="text-blue-600 font-medium hover:underline"
            >
              {policy.label}
            </Link>
            {index < filtered.length - 2 && ", "}
            {index === filtered.length - 2 && " and "}
          </span>
        ))}
        .
      </p>
    </div>
  );
}
