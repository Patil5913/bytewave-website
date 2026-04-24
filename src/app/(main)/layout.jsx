import { Inter } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import ServiceProvider from "@/providers/ServiceProvider";
import { TrainingProvider } from "@/providers/TrainingProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";
import WhatsAppChatButton from "@/components/WhatsappButton";
const inter = Inter({ subsets: ["latin"] });
import ScheduleMeetingButton from "@/components/Schedule_meeting";

export const metadata = {
  metadataBase: new URL("https://www.bytewavetechnology.com"),
  title: "Bytewave Technology",
  description:
    "Bytewave helps job seekers accelerate their careers with resume optimization, job search strategy, interview preparation, and professional guidance tailored to real market demands.",
  keywords: [
    "job search support",
    "career guidance services",
    "resume optimization",
    "interview preparation",
    "job application strategy",
    "staffing services",
    "career consulting",
    "job placement assistance",
    "professional resume help",
    "job search services",
  ],
  openGraph: {
    type: "website",
    siteName: "Bytewave",
    url: "https://www.bytewavetechnology.com",
    title: "Bytewave | Smarter Career Growth & Job Support",
    description:
      "Accelerate your job search with expert resume support, interview prep, and career strategy.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    title: "Bytewave Technology",
    statusBarStyle: "default",
    startupImage: ["/logo.png"],
  },
};
export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <ServiceProvider>
        <TrainingProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
            <div className="fixed right-8">
              <WhatsAppChatButton
                phone="+13127888738"
                message="Hi! I have a question about your product."
                size={50}
                showPopup={true}
              />
            </div>
            <ScheduleMeetingButton size={50} />
          </main>
          <Footer />
        </TrainingProvider>
      </ServiceProvider>
    </AuthProvider>
  );
}
