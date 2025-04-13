import React from "react";
import Image from "next/image";

export default function Page() {
  // Sample gallery images - replace with your own
  const galleryImages = [
    "/images/boutique-1.jpg",
    "/images/fashion-show.jpg",
    "/images/design-studio.jpg",
  ];

  return (
    <div className="min-h-screen bg-neutral-50 w-full">
      {/* Main content container */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Elegant header section */}
        <div className="text-start lg:text-center mb-12">
          <h1 className="lg:text-5xl text-4xl tracking-wide  text-gray-900 mb-3 ">
            About Us
          </h1>
          {/* <div className="w-32 h-0.5 bg-amber-700 mrr-auto lg:mx-auto mb-4"></div> */}
          
        </div>

        {/* Main content with Montserrat typography */}
        <div className="space-y-4 text-gray-700 mb-24">
          <p className="text-sm lg:text-lg leading-relaxed">
            Welcome to <span className=" font-semibold text-gray-900">Ruks á la Mode</span>, 
            where we believe that fashion is not just about clothing; it's a form of 
            self-expression. Our mission is to empower individuals to embrace their 
            unique style and feel confident in their choices.
          </p>

          <p className="text-sm lg:text-lg leading-relaxed">
            Founded in 2015, our atelier brings together European craftsmanship with 
            modern design sensibilities. Each Ruks á la Mode piece is conceived with 
            meticulous attention to detail, using only the finest materials sourced 
            from ethical suppliers worldwide.
          </p>

          <p className="text-sm lg:text-lg leading-relaxed">
            We understand that true style transcends seasonal trends. That's why our 
            collections focus on enduring quality and versatile silhouettes that become 
            cherished pieces in your wardrobe for years to come.
          </p>
        </div>

        {/* Classy gallery section */}
        <div className="mb-8 lg:mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-start lg:text-center border-b border-gray-200 pb-4">
            OUR WORLD
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden aspect-square"
              >
                <Image
                  src={image}
                  alt="Ruks á la Mode"
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 transition-all duration-300 group-hover:bg-opacity-30"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature section */}
        <div className="text-start lg:text-center mt-16 lg:mt-24">
          <p className="text-gray-600 mb-4">EST. 2015</p>
          <div className="w-24 h-px bg-gray-300 mr-auto lg:mx-auto mb-6"></div>
          <p className="text-sm lg:text-lg text-gray-700">
            "Elegance is the only beauty that never fades" — Audrey Hepburn
          </p>
        </div>
      </div>
    </div>
  );
}