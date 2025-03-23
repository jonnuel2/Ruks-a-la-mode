import React from "react";
import Question from "./question";

function Questions() {
  const questions = [
    {
      question: "What are your office and online operating hours?",
      answer:
        "Our office is open Monday to Friday from 11 AM to 5 PM, while our online store operates Monday to Saturday from 9 AM to 9 PM.",
    },
    {
      question: "How do I place an order?",
      answer:
        "Orders can be placed via our Website, Instagram DM or WhatsApp message.",
    },
    {
      question: "Do you have ready-to-wear outfits?",
      answer:
        "No, all our pieces are custom-made and require at least 7 working days for production.",
    },
    {
      question: "Can I visit your store to try on outfits?",
      answer:
        "You can visit our store for measurements and pickups, but we do not have a try-on service since our pieces are made to order.",
    },
    {
      question: "Can I make changes to the design of a piece?",
      answer:
        "Yes, we offer alterations such as longer sleeves or a maxi dress.",
    },
    {
      question: "How do I ensure I order the right size?",
      answer:
        "You can refer to our size guide or provide your exact measurements in inches (Bust, Waist, Hips, Length, etc.).",
    },
    {
      question: "Do you offer custom colors?",
      answer:
        "Yes, some designs have custom color options available at an extra charge.",
    },
    {
      question:
        "Will the fabric texture or color be the same as in the pictures?",
      answer:
        "While we try to ensure accuracy, camera quality and restock variations may cause slight differences in shade or texture.",
    },
    {
      question: "Can I cancel my order after placing it?",
      answer: "Orders cannot be canceled once production has started.",
    },
    {
      question: "Do you accept part payments?",
      answer:
        "Yes, you can pay 70% upfront and the remaining 30% before delivery.",
    },
    {
      question: "What transfer payment methods do you accept?",
      answer:
        "We accept direct bank transfers (Nigeria), Western Union, Zelle, Remitly, World Remit, Lemfi, and Tap Tap.",
    },
    {
      question: "Can I stockpile my order and pick it up later?",
      answer:
        "Yes, you can store your order for up to 2 months, after which we will no longer be responsible for it.",
    },
    {
      question: "What are your delivery timelines?",
      answer:
        "Abuja: 1-2 working days\nOther Nigerian cities (GIG): 3-5 working days (Standard), 2-3 working days (Express)\nInternational (DHL Express): 3-5 working days",
    },
    {
      question: "How much is the delivery fee?",
      answer:
        "Delivery fees are tentative and may change based on courier service rates.",
    },
    {
      question: "Can I choose a different delivery company?",
      answer: "Yes, if you prefer a different delivery service, let us know.",
    },
    {
      question: "What happens if I miss the delivery?",
      answer:
        "If the rider attempts delivery and you are unreachable, you may need to pay for delivery again.",
    },
    {
      question:
        "What should I do if I receive the wrong order or a damaged item?",
      answer:
        "Report it within 48 hours, and we will arrange for a return and exchange at no cost to you.",
    },
    {
      question: "Can I return an item if it doesn’t fit?",
      answer:
        "If the sizing issue is due to incorrect measurements provided, an amendment fee and delivery cost will apply.",
    },
    {
      question: "How long does it take to process a refund?",
      answer:
        "Local refunds take 48-72 hours, while international refunds take 3-5 working days after the item is returned.",
    },
    {
      question: "Do I agree to these policies by making a purchase?",
      answer:
        "Yes, by shopping with us, you acknowledge and accept these policies.",
    },
  ];
  return (
    <div
      className="lg:w-3/4 my-16 flex flex-col items-center space-y-5"
      id="faqs"
    >
      {questions.map((q, i) => (
        <Question key={i} question={q.question} answer={q.answer} />
      ))}
    </div>
  );
}

export default Questions;
