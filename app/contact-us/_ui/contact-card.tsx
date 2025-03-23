import React from "react";
import { SocialIcon } from "react-social-icons";

export default function ContactCard() {
  const socials = [
    { url: "https://www.instagram.com/ruksalamode", network: "instagram" },
    { url: "https://www.x.com/ruksalamode", network: "twitter" },
    { url: "https://www.tiktok/ruksalamode", network: "tiktok" },
    { url: "http://wa.me/2349012101539", network: "whatsapp" },
  ];
  return (
    <div className="lg:w-[45%] w-full bg-lightgrey lg:p-14 rounded-[40px] lg:mt-0 mt-12">
      <Tab label="Location">
        <p className="lg:w-3/5 lg:text-sm text-sm text-dark">
          Penthouse, Wing C, Deo Gracia Plaza, Utako, Abuja.
        </p>
      </Tab>
      <Tab label="Working Hours">
        <div>
          <p className="lg:text-sm text-sm text-dark">
            Monday To Friday 11:00 AM to 5:00 PM
          </p>
          <p className="lg:text-sm text-sm mt-1">
            Our Support Team is available 9am - 9pm, everyday but Sunday.
          </p>
        </div>
      </Tab>
      <Tab label="Contact us">
        <div>
          <p className="lg:w-1/2 lg:text-sm text-sm text-dark">
            +234 901 210 1539
          </p>
          <p className="mt-1 lg:text-sm text-sm text-dark">
            support@ruksalamode.com
          </p>
        </div>
      </Tab>

      <div className="flex space-x-4 pb-6 mb-6">
        {socials.map((s) => (
          <SocialIcon
            network={s.network}
            key={s.url}
            url={s.url}
            className="w-6 h-6"
            style={{ width: 40, height: 40 }}
            bgColor="transparent"
            fgColor="#0e0e0e"
          />
        ))}
      </div>
    </div>
  );
}

const Tab = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="w-full mb-6">
    <p className="uppercase text-xl">{label}</p>
    <div className="border-b my-2 border-dark/20" />
    {children}
  </div>
);
