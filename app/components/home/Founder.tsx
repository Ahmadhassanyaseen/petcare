// app/components/MeetFounder.tsx
"use client";
import Image from "next/image";

export default function MeetFounder() {
  return (
    <section className="w-full bg-gray-50 py-16 px-6 md:px-12 lg:px-20" id="about">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet the Website{" "}
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 bg-clip-text text-transparent">
              Founder
            </span>
          </h2>

          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mt-4">
            Meet the Heart Behind VET365.AI — <br /> Dr. Alexis Kole, DVM
          </h3>

          <p className="text-gray-700 mt-6 leading-relaxed">
            From her earliest days surrounded by horses, dogs, cats, chickens,
            llamas, and goats, Dr. Alexis Kole, DVM has devoted her life to
            caring for animals. Determined from childhood to become a
            veterinarian, Alexis worked tirelessly — earning scholarships,
            leaning on the love and support of her parents, and pushing through
            long hours of study — to turn her dream into reality. She’s since
            served both in emergency medicine and general practice, helping
            countless pets and families through their most critical moments.
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed">
            The idea for VET365.AI was born from personal heartbreak. While
            Alexis was abroad, her beloved Australian Shepherd, Missy, fell
            gravely ill. Her father, unaware of how critical the situation was,
            waited too long to seek emergency care — and Missy didn’t make it.
            That loss fueled Alexis’s mission: to ensure no pet parent ever
            feels helpless in a moment that matters most.
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed">
            VET365.AI is her answer — a 24/7 conversational AI built with the
            intelligence of millions of trusted veterinary resources, designed
            to help pet owners quickly recognize emergencies, take immediate
            action, and keep their pets safe and healthy anywhere in the world.
            For Dr. Kole, this isn’t just technology; it’s a promise that no
            pet should suffer because help wasn’t within reach.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/Founder.png" // replace with your image path
            alt="Dr. Alexis Kole with pets"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
