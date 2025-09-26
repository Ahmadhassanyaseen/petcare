"use client";

import About from "./components/home/About";
import Banner from "./components/home/Banner";
import Pricing from "./components/home/Pricing";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";





export default function Home() {
 

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-white">
      {/* Header */}
      <Header/>     

      {/* Hero Banner */}
      <Banner/>
      
      {/* Feature Section - Image left, text right */}
      <About/>
      
      {/* Pricing Section */}
      <Pricing/>
      

      {/* Footer */}
      <Footer/>
    
    </div>
  );
}
