import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Reveal from '../common/Reveal'

const BannerNew = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FBAA30] via-[#ff8a1e] to-[#ff6a3d]">
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pg-2.png')] bg-cover bg-center bg-no-repeat" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 lg:py-24">

          {/* Text Content */}
          <Reveal className="text-white space-y-6" direction="up">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Expert Pet Care
                <span className="block text-yellow-100">At Your Service</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-lg leading-relaxed">
                Comprehensive veterinary care for your beloved pets. From routine checkups to emergency services, we're here to keep your furry friends healthy and happy.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90 font-medium">24/7 Emergency Care</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90 font-medium">Expert Veterinarian</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90 font-medium">Modern Facilities</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/90 font-medium">Personalized Care</span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-white text-[#FBAA30] font-semibold px-8 py-4 shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 text-center"
              >
                Book Appointment
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-full bg-white/10 text-white font-semibold px-8 py-4 border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-center backdrop-blur-sm"
              >
                Our Services
              </Link>
            </div>
          </Reveal>

          {/* Image Content */}
          <Reveal className="relative flex justify-center lg:justify-end" delay={120} direction="up">
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-10">
                <Image
                  src="/bannerImg.png"
                  alt="Professional Pet Care"
                  width={900}
                  height={900}
                 
                  className="drop-shadow-2xl select-none pointer-events-none rounded-2xl"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-yellow-200/30 rounded-full blur-xl"></div>

              {/* Floating Card */}
              
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute -bottom-8 left-0 right-0 h-16 bg-white rounded-t-[50%_20%]" />
    </section>
  )
}

export default BannerNew