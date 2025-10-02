import { useEffect, useState } from "react";

const doctors = [
  { id: 1, name: "Dr. Gary", title: "Veterinarian", desc: "DVM, Emergency Veterinarian, BS (Physiology)", customers: "1,567", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Dr. Bruce", title: "Veterinarian", desc: "15 years of small animal veterinary medicine", customers: "2,038", img: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: 3, name: "Rebecca", title: "Veterinarian", desc: "More than 30 years of veterinary practice experience", customers: "1,057", img: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 4, name: "Dr. Smith", title: "Veterinarian", desc: "Specialist in exotic animals", customers: "980", img: "https://randomuser.me/api/portraits/men/78.jpg" },
  { id: 5, name: "Dr. Alice", title: "Veterinarian", desc: "Focus on preventive care and wellness", customers: "1,200", img: "https://randomuser.me/api/portraits/women/79.jpg" },
  { id: 6, name: "Dr. John", title: "Veterinarian", desc: "Expert in surgery and rehabilitation", customers: "1,450", img: "https://randomuser.me/api/portraits/men/90.jpg" },
];

export default function VeterinaryExperts() {
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function updateSlides() {
      const w = window.innerWidth;
      const newSlides = w < 640 ? 1 : w < 1024 ? 2 : 3;
      setSlidesPerView(newSlides);
    }

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const totalSlides = doctors.length;

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="w-full bg-yellow-100 py-12 px-6 md:px-16 lg:px-24">
      {/* Main flex container for text and image */}
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Your Veterinary Experts
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Access a network of verified, and licensed veterinarians to connect
            with your customers in under three minutes. They can diagnose
            issues, troubleshoot problems, and give your customers step-by-step
            instructions to help care for their animals.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://img.icons8.com/fluency/512/pet-commands-train.png"
            alt="Vet Icon"
            className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative mt-12 max-w-6xl mx-auto overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${(index * 100) / slidesPerView}%)`,
          }}
        >
          {doctors.concat(doctors).map((doc, i) => (
            <div
              key={i}
              className="w-full px-4"
              style={{ flex: `0 0 ${100 / slidesPerView}%` }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 w-full text-center">
                <img
                  src={doc.img}
                  alt={doc.name}
                  className="w-20 h-20 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800">{doc.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{doc.title}</p>
                <p className="text-gray-600 text-sm mb-3">{doc.desc}</p>
                <p className="text-green-600 font-medium">{doc.customers} satisfied customers</p>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-0 p-3 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-0 p-3 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
