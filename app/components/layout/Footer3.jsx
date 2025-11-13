// components/Footer.tsx
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import Image from "next/image";

export default function Footer3() {
  return (
   
    <footer className="bg-[#c5a4ff] text-black  px-10 md:px-20 py-10">
      {/* Left Section */}
      <div className="w-full text-center">
         <Image
              src="/footer.avif"
              alt="footer"
              width={200}
              height={200}
              priority
              className="object-contain"
            />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-stretch  border-b-1 border-black  text-black mt-4">
        {/* Left Section */}
        <div className="md:w-1/2 border-b-2 md:border-b-0 md:border-r-1 border-black flex flex-col justify-between  p-4">
          <div>
            <h1 className="font-black text-4xl md:text-5xl uppercase tracking-wide font-[Impact,Haettenschweiler,'Arial Black',sans-serif]">
              VET365–AI
            </h1>
            <p className="text-sm mt-2 leading-relaxed w-full md:w-1/2 ">
              Always ready on your phone or computer — checks foods, chemicals, and
              plants for danger, guides you in emergencies, and points you to the
              nearest emergency vet instantly.
            </p>
          </div>
        </div>
        {/* Right Section */}
        <div className="md:w-1/2 flex justify-end items-center gap-6 border-b-1 md:border-b-0 border-black  p-4">
          <a href="#" className="text-base font-semibold hover:underline">
            Legal
          </a>
          <div className="flex gap-4 text-2xl">
            <a href="#" aria-label="Instagram" className="hover:opacity-70 transition">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook" className="hover:opacity-70 transition">
              <FaFacebookF />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
