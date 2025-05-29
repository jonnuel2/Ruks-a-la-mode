"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/helpers/api-controller";
import { ProgressBar } from "react-loader-spinner";

export default function HomeBanners() {
  const {
    data: bannersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: () => getBanners(),
  });

  const banners = bannersData?.banners;

  return (
    <div className="w-full lg:h-screen">
      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p className="uppercase lg:font-bold font-black text-coffee text-lg lg:text-2xl tracking-wider lg:mb-16 mb-8">
            RUKS Á LA MODE
          </p>
          <ProgressBar borderColor="#0e0e0e" barColor="#0e0e0e" />
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full h-full"
        >
          {banners?.map((banner: any) => (
            <SwiperSlide key={banner.id}>
              {banner?.data?.videoUrl ? (
                <video
                  src={banner?.data?.videoUrl}
                  className="w-full lg:h-full h-80 object-cover"
                  autoPlay
                  loop
                  muted
                  controls
                />
              ) : (
                <div
                  className="w-full lg:h-full h-80 bg-cover bg-center"
                  style={{ backgroundImage: `url(${banner?.data?.imageUrl})` }}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
