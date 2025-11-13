import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Reveal from '../common/Reveal'

const About = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center overflow-hidden">
            {/* Left: Image with gradient blob background */}
            <Reveal className="relative mx-auto w-full max-w-md" direction="up">
              {/* Blob background */}
              <div className="absolute -left-6 -right-6 top-6 bottom-6 -z-10">
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="blobGradient" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#B57DFF" />
                      <stop offset="100%" stopColor="#B57DFF" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#blobGradient)"
                    opacity="0.95"
                    d="M322.5 261.5Q302 323 241 348.5T119 331.5Q73 293 55 236T75 133.5Q113 85 170 65.5t145 34q66 46.5 7.5 110.5t0 51z"
                  />
                </svg>
              </div>

              {/* Foreground image */}
              <div className="relative flex items-end justify-center">
                <Image
                  src="/pet_care.png"
                  alt="Pet photo"
                  width={440}
                  height={440}
                  className="drop-shadow-xl rounded-[28px] md:rounded-[32px]"
                  priority
                />
                {/* Soft base shadow ellipse */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-6 w-48 sm:w-64 rounded-full bg-black/10 blur-md" />
              </div>
            </Reveal>

            {/* Right: Text */}
            <Reveal className="text-center md:text-left" delay={120} direction="up">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-900">We care your pet</p>
              <h2 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                <span>As you </span>
                <span className="">care</span>
              </h2>
              <p className="mt-6 max-w-xl mx-auto md:mx-0 text-slate-600 leading-relaxed">
                Lorem ipsum dolor sit , consectetur adipiscing elit, sed do iusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan.
              </p>
              <div className="mt-8">
                <Link
                  href="#about"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-white font-semibold shadow-lg bg-gradient-to-r from-[#B57DFF] to-[#ff8a1e] hover:from-[#ff5a2b] hover:to-[#B57DFF] transition-colors"
                >
                  About Us
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
  )
}
export default About