"use client";
import Image from "next/image";

export default function Founder() {
  return (
    <section className="bg-[#c5a4ff] min-h-screen w-full px-6 md:px-16 py-16 text-black flex flex-col items-center">
      {/* Heading */}
      <div className="text-center max-w-4xl mb-10">
        <h1 className="font-extrabold text-[40px] md:text-[64px] leading-tight tracking-tight text-black">
          Meet the Heart Behind VET365.AI
        </h1>
        <p className="text-[20px] md:text-[22px] font-semibold italic mt-2">
          – Dr. Alexis Kole, DVM
        </p>
      </div>

      {/* Intro (above image) */}
      <p className="text-center text-[16px] md:text-[15px] leading-relaxed max-w-2xl mb-8">
        Hi, I’m <strong>Dr. Kole</strong> — veterinarian, lifelong animal lover, and the human
        heart behind Vet365-AI.
      </p>

      {/* Image + Paragraphs */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 items-start lg:gap-0">
        {/* Left - Image */}
        <div className="flex justify-center lg:justify-end">
          <Image
            src="/founder.avif"
            alt="Dr. Alexis Kole with her dog"
            width={390}
            height={600}
            className="rounded-lg object-cover h-auto max-w-md"
            priority
          />
        </div>

        {/* Right - Text */}
        <div className="text-[16px] md:text-[15px] leading-relaxed lg:pl-8">
          <p className="mb-4">
            For nearly seven years, I’ve cared for pets in emergencies, urgent situations, and
            everyday life, always guided by one simple principle: understanding the why behind
            what’s happening. I don’t believe in quick fixes or one-size-fits-all answers. Even
            seemingly simple questions can have layers, and taking the time to explain them is
            what builds trust, empowers owners, and keeps pets healthier in the long run. I wish
            I could answer every question personally, because every pet — and every concern —
            deserves more than surface-level advice. My goal is to provide owners with thorough,
            thoughtful, and accurate information so they can make confident, informed decisions
            for their four-legged family members.
          </p>

          <p className="mb-4">
            In practice, I love teaching and sharing knowledge. So much so that I jokingly tell
            my team to <em>“get the hook”</em> when I start talking too long, because I could
            easily spend hours explaining the reasoning behind tests, treatments, and
            preventative care. For me, communication isn’t just a skill — it’s the foundation of
            prevention. When I help an owner understand why something matters, why a test is
            important, or why a certain treatment works, they are not only equipped to make
            better, more confident decisions for their pet’s health but also hopefully get
            reassurance that they are not alone in some of the heavy decision-making that goes
            into being a pet parent. Explaining the why isn’t just fulfilling for me; it’s the
            only way to build trust and ensure quality care.
          </p>

          <p>
            That same philosophy guides Vet365-AI. I wish I could be everywhere at once to
            answer every question, so I built Kora. To deliver the same thoughtful, articulate,
            and accurate guidance that I would provide in person. Every response is inspired,
            refined, and shaped by real-world veterinary experience, so you know it’s thorough,
            reliable, and empathetic — just like I would provide myself.
          </p>
        </div>
      </div>

      {/* Closing Text */}
      <p className="text-center text-[16px] md:text-[15px] leading-relaxed mt-10 max-w-3xl">
        Through my guidance and Kora’s carefully refined expertise, you get answers you can
        truly trust — empowering you to act with confidence, care, and peace of mind for your
        beloved pets every step of the way.
      </p>
    </section>
  );
}
