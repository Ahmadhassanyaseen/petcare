"use client";
import NavbarBanner from "@/app/components/home/Navbar";
import Banner from "@/app/components/home/Banner";
import Plans from "./components/home/Plans";
import Founder from "@/app/components/home/Founder";
import Mission from "@/app/components/home/Mission";
import Footer from "@/app/components/layout/Footer";

export default function Home() {
  return (
    <>
      {/* ElevenLabs ConvAI Widget Script */}

      <div
        className="font-sans text-gray-800 min-h-screen bg-white"
        style={{ overflowX: "hidden" }}
      >
       <div className="relative min-h-screen max-h-screen bg-[#B57DFF]">
        <NavbarBanner />
        <Banner />
       </div> 
        <Mission />

        <Plans />

        <Founder />

        <Footer />
      </div>
    </>
  );
}
