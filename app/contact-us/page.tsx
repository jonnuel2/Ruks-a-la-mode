import React from "react";
import ContactForm from "./_ui/contact-form";
import ContactCard from "./_ui/contact-card";
import Questions from "./_ui/questions";
import HeroText from "../ui/hero-text";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center flex-col w-full lg:px-16 px-6 pt-3 overflow-hidden">
      <div className="lg:flex-row flex flex-col items-center justify-between w-full">
        <ContactForm />
        <ContactCard />
      </div>
      <HeroText
        title="Support"
        subtitle="Whether you need assistance with product setup, troubleshooting, or general inquiries, our knowledgeable and friendly support staff is just a phone call or email away."
      />
      <Questions />
    </div>
  );
}
