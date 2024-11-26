import logo from './logo.svg';
import './App.css';
import Page from "./page.js";
import Providers from "./providers";
import bgPattern from "./public/bg-pattern-transparent.png";
// import PlausibleProvider from "next-plausible";
// import localFont from "next/font/local";
import bhlogo from "./fonts/bhramlogo.png";


const geistSans = {
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
};
const geistMono = {
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
};

let title = "BhramAi – Real-Time AI Image Generator";
let description = "Generate images with AI in a milliseconds";
let url = "https://www.bhramAi.io/";

let sitename = "bhramlogo.io";

export const metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [bhlogo],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [bhlogo],
    title,
    description,
  },
};
function App() {
  return (
    <>
      <head>
        <meta name="color-scheme" content="dark" />
       
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark h-full min-h-full bg-[length:6px] font-mono text-gray-100 antialiased`}
        style={{ backgroundImage: `url(${bgPattern.src}` }}
      >
        <Providers><Page></Page></Providers>
      </body>
   </>
  );
}

export default App;
