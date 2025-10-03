"use client";

import About from "./components/home/About";
import Banner2 from "./components/home/Banner2";
import Plans from "./components/home/Plans";
import Footer2 from "./components/layout/Footer2";
import Banner3 from "./components/home/Banner3";
// import Chat from "./components/chat/Chat";
import Founder from "./components/home/Founder";
import Support from "./components/home/Support";





export default function Home() {
 

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-white" style={{ overflowX: "hidden" }}>
      {/* Header */}
      <Banner3/>     

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
  );
}
