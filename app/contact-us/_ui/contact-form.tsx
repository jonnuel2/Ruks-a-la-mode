// "use client";

// import { useState } from "react";

// export default function ContactForm() {
//   const [messager, setMessager] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });
//   return (
//     <div className="lg:w-1/2 w-full">
//       <p className="lg:text-5xl text-2xl">Contact Us</p>
//       <p className="mt-3 opacity-90 lg:text-base text-sm text-dark">
//         Send a message and our team will get back to you within 24 hrs
//       </p>
//       <div className="flex flex-col items-start space-y-5 lg:my-10 my-6">
//         <input
//           placeholder="Name"
//           className="lg:px-6 px-3 bg-transparent border border-dark lg:h-16 h-10 w-full"
//           type="text"
//           value={messager.name}
//           onChange={(e) => setMessager({ ...messager, name: e.target.value })}
//         />
//         <input
//           placeholder="Email"
//           className="lg:px-6 px-3 bg-transparent border border-dark lg:h-16 h-10 w-full"
//           type="email"
//           value={messager.email}
//           onChange={(e) => setMessager({ ...messager, email: e.target.value })}
//         />
//         <textarea
//           placeholder="Message"
//           className="lg:px-6 pt-6 px-3 bg-transparent border border-dark w-full lg:h-44 h-28"
//           value={messager.message}
//           onChange={(e) =>
//             setMessager({ ...messager, message: e.target.value })
//           }
//         />
//       </div>
//       <div
//         className="bg-dark py-2 px-3 w-fit cursor-pointer hover:bg-dark/75"
//         onClick={() => {
//           if (!messager.email || !messager.name || !messager.email) return;

//           const subject = `Contact from ${messager?.name}`;
//           const body = `Name: ${messager?.name}%0D%0AEmail: ${messager.email}%0D%0AMessage:%0D%0A${messager.message}`;

//           const mailtoLink = `mailto:support@ruksalamode.com?subject=${subject}&body=${body}`;
//           window.open(mailtoLink, "_blank");
//           setMessager({ name: "", email: "", message: "" });
//         }}
//       >
//         <p className="text-lightgrey">Send Message</p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [messager, setMessager] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });

  const handleSubmit = async () => {
    if (!messager.email || !messager.name || !messager.message) {
      return;
    }

    setStatus({ loading: true, error: false, success: false });

    try {
      await emailjs.send(
        'service_8soz4xk',
        'template_afxnrtp',
        {
          from_name: messager.name,
          from_email: messager.email,
          message: messager.message,
          to_email: 'support@ruksalamode.com',
        },
        'nQo6ev2cTJ3sZ4sBl'
      );

      setStatus({ loading: false, error: false, success: true });
      setMessager({ name: "", email: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus({ loading: false, error: true, success: false });
    }
  };

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
      <div className="flex flex-col items-start gap-3">
        <button
          className={`bg-dark py-2 px-3 cursor-pointer hover:bg-dark/80 disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleSubmit}
          disabled={status.loading || !messager.email || !messager.name || !messager.message}
        >
          <p className="text-lightgrey">
            {status.loading ? 'Sending...' : 'Send Message'}
          </p>
        </button>
        
        {status.error && (
          <p className="text-red-500 text-sm">
            Failed to send message. Please try again.
          </p>
        )}
        
        {status.success && (
          <p className="text-green-500 text-sm">
            Message sent successfully!
          </p>
        )}
      </div>
    </div>
  );
}
