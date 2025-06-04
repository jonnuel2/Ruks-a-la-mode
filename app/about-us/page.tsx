import React from "react";
import Image from "next/image";

export default function Page() {
  // Sample gallery images - replace with your own
  const galleryImages = [
    "/images/about-us/ab1.jpeg",
    "/images/about-us/ab3.jpeg",
    "/images/about-us/ab2.jpeg",
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
            At{" "}
            <span className=" font-semibold text-gray-900">Ruks Á La Mode</span>
            , we blend fashion with comfort, making chic style accessible to
            all! Established in 2017 and proudly crafted in Abuja, Nigeria,
            we strive to provide you with the finest in style. With over 5,000
            satisfied customers and 1M+ items sold in more than 20 countries.
            Every item is custom made to order, guaranteeing a flawless fit and
            a wardrobe that reflects your individuality. The best part? We ship
            worldwide, so you can enjoy our stunning pieces wherever you are!
          </p>

          {/* <p className="text-sm lg:text-lg leading-relaxed">
            Founded in 2015, our atelier brings together European craftsmanship with 
            modern design sensibilities. Each Ruks á la Mode piece is conceived with 
            meticulous attention to detail, using only the finest materials sourced 
            from ethical suppliers worldwide.
          </p> */}

          {/* <p className="text-sm lg:text-lg leading-relaxed">
            We understand that true style transcends seasonal trends. That's why our 
            collections focus on enduring quality and versatile silhouettes that become 
            cherished pieces in your wardrobe for years to come.
          </p> */}
        </div>

        {/* Classy gallery section */}
        <div className="mb-8 lg:mb-16">
         
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

        
      </div>
    </div>
  );
}
