import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Reveal from '../common/Reveal'
const Banner = () => {
  return (
    <section
          className="relative"
        >
          <div
            className="relative overflow-hidden"
            style={{
              backgroundImage: 'url(/banner.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#B57DFF] to-[#B57DFF] opacity-95" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 lg:py-24">
                {/* Text content */}
                <Reveal className="text-white" direction="up">
                  <p className="text-3xl sm:text-4xl font-light leading-tight">We Care</p>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mt-2 tracking-tight">Your Pets</h1>
                  <p className="mt-6 max-w-md text-white/90">
                    Lorem ipsum dolor sit , consectetur adipiscing elit, sed do iusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan.
                  </p>
                  <div className="mt-8">
                    <Link
                      href="#contact"
                      className="inline-flex items-center rounded-full bg-white text-[#B57DFF] font-medium px-6 py-3 shadow hover:bg-gray-50 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </div>
                </Reveal>

                {/* Dog Image */}
                <Reveal className="relative flex justify-center md:justify-end" delay={120} direction="up">
                  <Image
                    src="/dog.png"
                    alt="Cute dog"
                    width={560}
                    height={560}
                    priority
                    className="drop-shadow-xl select-none pointer-events-none"
                  />
                </Reveal>
              </div>
            </div>

            {/* Bottom curve effect */}
            <div className="absolute -bottom-8 left-0 right-0 h-16 bg-white rounded-t-[48%_12%]" />
          </div>
        </section>
  )
}

export default Banner