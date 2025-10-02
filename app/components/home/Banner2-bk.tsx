import React from "react";
import Image from "next/image";

const Banner2 = () => {
  return (
    <div className='relative flex flex-col items-center justify-center py-[50px] gap-4 font-poppins text-center bg-[url("/bgbanner2.png")] bg-cover bg-center bg-no-repeat'>
      <h1
        className="text-8xl text-white font-bold"
        style={{
          textShadow: `
    -3px -3px 0 #004aad ,
    3px -3px 0 #004aad ,
    -3px 3px 0 #004aad ,
    3px 3px 0 #004aad ,
    -3px 0 0 #004aad ,
    3px 0 0 #004aad ,
    0 -3px 0 #004aad ,
    0 3px 0 #004aad 
  `,
        }}
      >
        VET365.AI
      </h1>

      <h1
        className="text-4xl text-white font-bold"
        style={{
          textShadow: `
    -3px -3px 0 #004aad ,
    3px -3px 0 #004aad ,
    -3px 3px 0 #004aad ,
    3px 3px 0 #004aad ,
    -3px 0 0 #004aad ,
    3px 0 0 #004aad ,
    0 -3px 0 #004aad ,
    0 3px 0 #004aad 
  `,
        }}
      >
        Talk with our Veterinarian approved AI pet health expert 24/7
      </h1>
      <div className="flex items-center justify-around">
         <div className="w-[68%] ">
            <p className="text-3xl text-[#005e92] mb-2"  style={{
          textShadow: `
    -1px -1px 0 #ffffffff ,
    1px -1px 0 #ffffffff ,
    -1px 1px 0 #ffffffff ,
    1px 1px 0 #ffffffff ,
    -1px 0 0 #ffffffff ,
    1px 0 0 #ffffffff ,
    0 -1px 0 #ffffffff ,
    0 1px 0 #ffffffff 
  `,
        }}>Protect Your Pet !</p>
            <p className="text-[#004aad] bg-blue-100 " style={{ display:'inline',padding:'2px' }}>Your pet’s health answers — anytime, anywhere. Meet your personal AI veterinary assistant — a smart, conversational companion that talks with you naturally (not just a simple text bot). Available 24/7 on your phone or computer, it helps you check if foods, chemicals, or plants are dangerous, guides you step by step during emergencies, and pinpoints the closest emergency vet when every second counts. While not a replacement for your veterinarian, it gives you instant, trustworthy answers and peace of mind whenever you need them. Subscribe now and keep expert pet health advice at your fingertips.</p>
            <Image
            src="/animals.svg"
              alt="arrow"
              width={800}
              height={800}
              className="mt-5 w-[900px] pb-10"
              />
              <div className="flex flex-row gap-14 -mt-25" style={{ position:'absolute', left:'0',bottom:'40px' }}>
                <div className="w-[155px] h-[155px] bg-[#005e92] rounded-full flex items-center justify-center text-white text-xl font-bold -mt-40">
                  <p>Speak to an Expert 24/7</p>
                </div>
                <div className="w-[155px] h-[155px] bg-[#005e92] rounded-full flex items-center justify-center text-white font-bold flex-col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#fff"
                    className="rotate-225 w-[70px] h-[70px]"
                    id="Layer_1"
                    enableBackground="new 0 0 512 512"
                    height="512"
                    viewBox="0 0 512 512"
                    width="512"
                  >
                    <path d="m8 512c2.047 0 4.095-.781 5.657-2.343l45.614-45.614c6.363 4.138 13.688 6.212 21.014 6.212 9.874 0 19.748-3.758 27.266-11.275l39.767-39.767 6.264 6.264c4.84 4.839 11.194 7.259 17.552 7.258 6.355 0 12.714-2.42 17.553-7.258l208.35-208.35 21.508 21.508c5.597 5.597 13.039 8.68 20.954 8.68 7.916 0 15.357-3.083 20.954-8.679 5.598-5.597 8.681-13.039 8.681-20.955s-3.083-15.357-8.68-20.954l-51.199-51.199 52.185-52.188 11.725 11.725c4.436 4.435 10.261 6.652 16.086 6.652s11.65-2.217 16.086-6.652c8.869-8.87 8.869-23.302 0-32.171l-66.229-66.23c-8.872-8.871-23.303-8.87-32.173 0-8.869 8.87-8.869 23.302 0 32.171l11.725 11.725-52.187 52.187-51.198-51.198c-5.598-5.597-13.039-8.68-20.955-8.68-7.915 0-15.356 3.083-20.954 8.68-11.554 11.554-11.554 30.354 0 41.909l21.508 21.508-208.352 208.349c-4.688 4.688-7.27 10.921-7.27 17.552s2.582 12.864 7.27 17.552l6.264 6.264-39.766 39.767c-13.094 13.094-14.778 33.339-5.062 48.279l-45.615 45.614c-3.124 3.124-3.124 8.189 0 11.313 1.562 1.563 3.609 2.344 5.657 2.344zm410.249-484.479c-2.632-2.631-2.632-6.913 0-9.544 1.315-1.316 3.044-1.974 4.772-1.974s3.456.658 4.771 1.974l66.229 66.23c2.632 2.631 2.632 6.913 0 9.544-2.631 2.631-6.912 2.631-9.543 0zm11.724 34.352 20.153 20.153-52.187 52.187-20.153-20.153zm-145.293 20.27c-5.315-5.316-5.315-13.966 0-19.282 2.575-2.575 5.998-3.993 9.64-3.993 3.643 0 7.065 1.418 9.641 3.993l145.177 145.179h.001c2.575 2.575 3.993 5.999 3.993 9.64s-1.418 7.065-3.994 9.641c-2.575 2.575-5.998 3.993-9.641 3.993-3.642 0-7.064-1.418-9.64-3.993zm-186.843 252.486 208.35-208.35 79.534 79.534-10.042 10.042-38.307-38.307c-3.124-3.124-8.189-3.124-11.314 0-3.124 3.124-3.125 8.19 0 11.314l38.307 38.307-11.398 11.398-18.376-18.377c-3.124-3.124-8.189-3.124-11.314 0-3.124 3.124-3.125 8.19 0 11.314l18.376 18.377-11.398 11.398-38.307-38.308c-3.124-3.124-8.189-3.124-11.314 0-3.124 3.124-3.125 8.19 0 11.314l38.307 38.308-11.398 11.398-18.376-18.377c-3.124-3.124-8.189-3.124-11.314 0-3.124 3.124-3.125 8.19 0 11.314l18.376 18.377-11.398 11.398-38.307-38.308c-3.124-3.124-8.189-3.124-11.314 0-3.124 3.124-3.125 8.19 0 11.314l38.307 38.308-11.398 11.398-18.376-18.377c-3.124-3.124-8.189-3.124-11.314 0-3.124 3.124-3.125 8.19 0 11.314l18.377 18.377-11.398 11.398-38.308-38.307c-3.124-3.124-8.189-3.124-11.314 0-3.124 3.124-3.125 8.19 0 11.314l38.307 38.307-11.398 11.398-18.377-18.377c-3.124-3.124-8.189-3.124-11.314 0-3.124 3.124-3.125 8.19 0 11.314l18.377 18.377-11.398 11.398-38.308-38.308c-3.124-3.124-8.189-3.124-11.314 0-3.125 3.124-3.125 8.19 0 11.314l38.308 38.307-5.298 5.298c-3.441 3.439-9.039 3.439-12.477 0l-66.84-66.839c-1.582-1.582-2.647-3.658-2.785-5.891-.158-2.564.768-5.004 2.568-6.803zm-33.503 81.135 39.766-39.767 31.903 31.903-39.766 39.767c-8.796 8.795-23.107 8.796-31.903 0s-8.796-23.108 0-31.903z" />
                  </svg>
                  <p>Pet Medicine Explinations</p>
                </div>
                <div className="w-[155px] h-[155px] bg-[#005e92] rounded-full flex items-center justify-center text-white font-bold flex-col gap-2">
                  <Image src="/food.svg" alt="arrow" width={50} height={50} />
                  <p>Pet Food <br /> Advice</p>
                </div>
                 <div className="w-[155px] h-[155px] bg-[#005e92] rounded-full flex items-center justify-center text-white text-xl font-bold gap-2">
                  <p>Exercise <br /> Advice</p>
                </div>
                <div className="w-[155px] h-[155px] bg-[#005e92] rounded-full flex items-center justify-center text-white font-bold -mt-40 flex-col gap-2">
                  <Image src="/collar.svg" alt="arrow" width={50} height={50} />
                  <p>General <br /> Advice</p>
                </div>
              </div>
          </div>
          <div className="w-[20%]"></div>
      </div>
    </div>
  );
};

export default Banner2;
