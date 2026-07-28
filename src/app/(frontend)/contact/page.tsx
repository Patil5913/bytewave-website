import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ContactTerminal from "@components/ContactTerminal";

type Props = {
  searchParams: Promise<{ as?: string }>;
};

export const metadata = {
  title: "Contact · find & hire",
  description:
    "Start your intake — verified hiring for companies and professionals.",
};

// `/contact?as=company` opens the enterprise intake; default is talent.
export default async function ContactPage({ searchParams }: Props) {
  const { as } = await searchParams;
  const mode = as === "company" || as === "enterprise" ? "enterprise" : "talent";

  return (
    <>
      <Navbar />
      <main className="min-h-svh w-full bg-canvas pt-24">
        <ContactTerminal mode={mode} />
      </main>
      <Footer />
    </>
  );
}
