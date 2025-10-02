"use client";

import About from "./components/home/About";
import Banner2 from "./components/home/Banner2";
import Pricing2 from "./components/home/Pricing2";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Chat from "./components/chat/Chat";
import Experts from "./components/home/Experts";





export default function Home() {
 

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-white">
      {/* Header */}
      <Header/>     

      {/* Hero Banner2 */}
      <Banner2/>
      
      {/* Feature Section - Image left, text right */}
      {/* <About/> */}
      
      {/* Pricing Section */}
      <Pricing2/>
      

      {/* Footer */}
      {/* <Footer/> */}

      {/* Chat Component */}
      <Chat/>

      <Experts />
    
    </div>
  );
}
