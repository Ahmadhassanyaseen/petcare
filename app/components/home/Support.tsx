// components/PetSupportSection.tsx
export default function PetSupportSection() {
  return (
    <section className="bg-[#fafafd] py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Compassionate AI Support for Pet Parents
        </h2>
        <p className="mt-2 text-xl md:text-2xl font-semibold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Seamless Help, Anytime
        </p>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Instant Support */}
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden">
              <img
                src="/Vector.png"
                alt="Instant Support"
                className="h-10 w-10 object-contain"
              />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Instant Support</h3>
            <p className="mt-2 text-gray-600 text-sm md:text-base">
              Get quick AI voice help for any pet concern, anytime.
            </p>
          </div>

          {/* Personalized Care */}
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden">
              <img
                src="/care.png"
                alt="Personalized Care"
                className="h-10 w-10 object-contain"
              />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Personalized Care</h3>
            <p className="mt-2 text-gray-600 text-sm md:text-base">
              Tailored advice based on your pet's age, breed, and needs.
            </p>
          </div>

          {/* Always Available */}
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-md overflow-hidden">
              <img
                src="/available.png"
                alt="Always Available"
                className="h-10 w-10 object-contain"
              />
            </div>
            <h3 className="mt-4 font-semibold text-lg">Always Available</h3>
            <p className="mt-2 text-gray-600 text-sm md:text-base">
              Reliable pet care guidance anywhere, without delays or stress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
