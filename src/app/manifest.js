export default function manifest() {
  return {
    name: "Bytewave Technology",
    short_name: "Bytewave",
    description:
      "Bytewave helps job seekers accelerate their careers with resume optimization, job search strategy, interview preparation, and professional guidance tailored to real market demands.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
