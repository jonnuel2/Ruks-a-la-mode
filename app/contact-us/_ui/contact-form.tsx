"use client";

import { useState } from "react";

export default function ContactForm() {
  const [messager, setMessager] = useState({
    name: "",
    email: "",
    message: "",
  });
  return (
    <div className="lg:w-1/2 w-full">
      <p className="lg:text-5xl text-2xl">Contact Us</p>
      <p className="mt-3 opacity-90 lg:text-base text-sm text-dark">
        Send a message and our team will get back to you within 24 hrs
      </p>
      <div className="flex flex-col items-start space-y-5 lg:my-10 my-6">
        <input
          placeholder="Name"
          className="lg:px-6 px-3 bg-transparent border border-dark lg:h-16 h-10 w-full"
          type="text"
          value={messager.name}
          onChange={(e) => setMessager({ ...messager, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="lg:px-6 px-3 bg-transparent border border-dark lg:h-16 h-10 w-full"
          type="email"
          value={messager.email}
          onChange={(e) => setMessager({ ...messager, email: e.target.value })}
        />
        <textarea
          placeholder="Message"
          className="lg:px-6 pt-6 px-3 bg-transparent border border-dark w-full lg:h-44 h-28"
          value={messager.message}
          onChange={(e) =>
            setMessager({ ...messager, message: e.target.value })
          }
        />
      </div>
      <div
        className="bg-dark py-2 px-3 w-fit cursor-pointer hover:bg-lightgrey"
        onClick={() => {
          if (!messager.email || !messager.name || !messager.email) return;

          const subject = `Contact from ${messager?.name}`;
          const body = `Name: ${messager?.name}%0D%0AEmail: ${messager.email}%0D%0AMessage:%0D%0A${messager.message}`;

          const mailtoLink = `mailto:support@ruksalamode.com?subject=${subject}&body=${body}`;
          window.open(mailtoLink, "_blank");
          setMessager({ name: "", email: "", message: "" });
        }}
      >
        <p className="text-lightgrey hover:text-dark">Send Message</p>
      </div>
    </div>
  );
}
