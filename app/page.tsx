"use client";
// import About from "./components/home/About";
// import Banner2 from "./components/home/Banner2";
import Plans from "./components/home/Plans";
import Footer2 from "./components/layout/Footer2";
import Footer3 from "./components/layout/Footer3";
// import Banner3 from "./components/home/Banner3";
import Banner4 from "./components/home/Banner4";

// import Script from "next/script";
// import Chat from "./components/chat/Chat";
import Founder2 from "./components/home/Founder2";
// import Support from "./components/home/Support";
import PricingSection from "./components/home/PricingSection";

import Mission from "./components/home/Mission";
import Banner5 from "./components/home/Banner5";
import NavbarBanner from "./components/home/Navbar";
// import { Conversation } from "./components/chat/Conversation";

export default function Home() {
  return (
    <>
      {/* ElevenLabs ConvAI Widget Script */}
    

      <div className="font-sans text-gray-800 min-h-screen bg-white" style={{ overflowX: "hidden" }}>
        {/* ElevenLabs ConvAI Widget */}
    
        {/* Header */}
        {/* <Banner3/> */}
        <NavbarBanner />
        <Banner5 />

        {/* Hero Banner2 */}
        {/* <Banner2/> */}
        {/* <Support /> */}
        <Mission/>
       

        {/* Feature Section - Image left, text right */}
        {/* <About/> */}

        {/* Pricing Section */}
        {/* <Plans/> */}
        <PricingSection />

        {/* Chat Component */}
        {/* <Chat/> */}

        <Founder2 />
         {/* Footer */}
        {/* <Footer2/> */}
        <Footer3/>

      </div>
    </>
  );
}
