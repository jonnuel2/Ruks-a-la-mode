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
          No. 27, Beechwood Avenue, Minfa 1 Garden Estate, Lokogoma, Abuja.
        </p>
      </Tab>
      <Tab label="Working Hours">
        <div>
          <p className="lg:text-sm text-sm text-dark">
            In-Store: Monday to Friday, 11:00 AM – 5:00 PM
          </p>
          <p className="lg:text-sm text-sm mt-1">
            Online: Monday to Saturday, 10:00 AM – 8:00 PM
          </p>
        </div>
      </Tab>
      <Tab label="Contact us">
        <div className="space-y-6 text-sm text-dark leading-relaxed lg:w-2/3">
          <div>
            <h3 className="font-semibold text-base mb-1">General Support</h3>
            <p>
              Need help? Want to partner with us? <br /> Reach out to us via:
              <br />
              <a href="tel:+2349012101539" className="underline font-medium">
                +234 901 210 1539
              </a>
              <br />
              <a
                href="mailto:ruksalamode@gmail.com"
                className="underline font-medium"
              >
                ruksalamode@gmail.com
              </a>
              .
            </p>
          </div>

          {/* <div>
            <h3 className="font-semibold text-base mb-1">
              Business & Partnerships
            </h3>
            <p>
              For wholesale, retail or stockist partnerships, and
              collaborations, kindly email us at{" "}
              <a
                href="mailto:ruksalamode@gmail.com"
                className="underline font-medium"
              >
                ruksalamode@gmail.com
              </a>
              .
            </p>
          </div> */}
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
