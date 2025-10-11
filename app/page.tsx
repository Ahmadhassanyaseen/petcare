"use client";
// import About from "./components/home/About";
// import Banner2 from "./components/home/Banner2";
import Plans from "./components/home/Plans";
import Footer2 from "./components/layout/Footer2";
import Banner3 from "./components/home/Banner3";
// import Script from "next/script";
// import Chat from "./components/chat/Chat";
import Founder from "./components/home/Founder";
import Support from "./components/home/Support";
// import { Conversation } from "./components/chat/Conversation";

export default function Home() {
  return (
    <>
      {/* ElevenLabs ConvAI Widget Script */}
    

      <div className="font-sans text-gray-800 min-h-screen bg-white" style={{ overflowX: "hidden" }}>
        {/* ElevenLabs ConvAI Widget */}
    
        {/* Header */}
        <Banner3/>
        {/* This is test */}

        {/* Hero Banner2 */}
        {/* <Banner2/> */}
        <Support />
       

        {/* Feature Section - Image left, text right */}
        {/* <About/> */}

        {/* Pricing Section */}
        <Plans/>

        {/* Chat Component */}
        {/* <Chat/> */}

        <Founder />
         {/* Footer */}
        <Footer2/> 

      </div>
    </>
  );
}
