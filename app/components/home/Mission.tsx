"use client";
import Image from "next/image";

export default function Mission() {
  return (
    <main className="min-h-screen bg-[#B57DFF] flex flex-col justify-center px-6 md:px-16 py-16">
      {/* Heading */}
      <div className="mb-10 text-left  max-w-7xl w-full mx-auto">
        <h1 className="text-[42px] md:text-[64px] font-extrabold leading-tight text-black">
          Built by a Vet, <br className="hidden md:block" />
          Designed for You.
        </h1>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-7xl w-full mx-auto">
        {/* Left - Mission Text */}
        <div className="bg-[#ffb930] rounded-3xl p-8 md:p-12 text-black flex flex-col justify-center shadow-lg">
          <h2 className="text-[22px] md:text-[26px] font-extrabold mb-4 border-b border-black inline-block">
            Our Mission
          </h2>
          <p className="text-[16px] md:text-[18px] leading-relaxed mb-4">
            🐾 Ever found yourself staring at your pet thinking,
            <br />
            <em>“Is that normal… or do we have a situation?”</em>
            <br />
            <strong>We get it — because we’ve all been there.</strong>
          </p>

          <p className="text-[16px] md:text-[18px] leading-relaxed mb-4">
            That’s why Vet365 AI was created:
            <br />
            to bring together the <strong>
              heart of a real veterinarian
            </strong>{" "}
            and the <strong>brains of cutting-edge AI</strong> so pet parents
            everywhere can get instant answers and real peace of mind day,
            night, or treat-time.
          </p>

          <p className="text-[16px] md:text-[18px] leading-relaxed mb-4">
            No waiting rooms. No late-night panic searches.
            <br />
            Just <em>calm, compassionate</em> guidance from an AI vet that
            actually <strong>gets it.</strong>
          </p>

          <p className="text-[16px] md:text-[18px] leading-relaxed mb-4">
            Your go-to for <strong>real, reliable</strong> pet care anytime.
          </p>

          <p className="text-[16px] md:text-[18px] leading-relaxed mb-4">
            Vet365.AI is{" "}
            <strong>built and trained by a real veterinarian</strong> using
            trusted, vet-approved resources.
          </p>

          <p className="text-[16px] md:text-[18px] leading-relaxed mb-4">
            Whether you’ve got a quick question or an urgent concern, you’ll get{" "}
            <strong>real-time, reliable</strong> answers and{" "}
            <strong>step-by-step guidance</strong> to help you go from anxious
            to assured in a single conversation — <em>any day, any hour.</em>
          </p>

          <p className="text-[16px] md:text-[18px] leading-relaxed mb-6">
            It’s like having your vet’s brain on call, 24/7 💙
          </p>

          <button className="bg-black text-white px-6 py-3 rounded-full font-semibold text-[16px] w-fit hover:bg-gray-900 transition">
            Unleash Answers
          </button>
        </div>

        {/* Right - Image */}
        <div className="rounded-3xl overflow-hidden ">
          <Image
            src="/Bannerimage.png" // Place your image in /public/dogs.jpg
            alt="Dogs sitting in sunlight"
            width={800}
            height={600}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>
    </main>
  );
}
