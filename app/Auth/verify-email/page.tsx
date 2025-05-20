// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import Link from "next/link"
// import axios from "axios"

// export default function VerifyEmailPage() {
//   const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
//   const [message, setMessage] = useState("")
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const token = searchParams.get("token")

//   useEffect(() => {
//     if (!token) {
//       setStatus("error")
//       setMessage("Invalid verification link. No token provided.")
//       return
//     }

//     const verifyEmail = async () => {
//       try {
//         console.log("Verifying email with token:", token)
//         const response = await axios.post("/api/auth/verify-email", { token })
//         console.log("Verification response:", response.data)

//         if (response.data.success) {
//           setStatus("success")
//           setMessage(response.data.message || "Your email has been successfully verified!")
//         } else {
//           setStatus("error")
//           setMessage(response.data.message || "Failed to verify your email. Please try again.")
//         }
//       } catch (error) {
//         console.error("Error verifying email:", error)
//         setStatus("error")
//         setMessage(
//           error.response?.data?.message || "An error occurred while verifying your email. Please try again later.",
//         )
//       }
//     }

//     verifyEmail()
//   }, [token])

//   return (
//     <div className="flex flex-col items-center justify-center w-full h-[80vh]">
//       <div className="text-center max-w-md px-4">
//         {status === "loading" && (
//           <>
//             <h2 className="text-3xl font-bold mb-6">VERIFYING YOUR EMAIL</h2>
//             <div className="flex justify-center mb-6">
//               <div className="h-12 w-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
//             </div>
//             <p>Please wait while we verify your email address...</p>
//           </>
//         )}

//         {status === "success" && (
//           <>
//             <h2 className="text-3xl font-bold mb-6">EMAIL VERIFIED</h2>
//             <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
//               <p className="mb-4">{message}</p>
//               <p>You can now log in to your account.</p>
//             </div>
//             <Link href="/auth/login">
//               <button className="bg-black/85 hover:opacity-70 text-white py-3 px-6 rounded-md text-sm uppercase">
//                 GO TO LOGIN
//               </button>
//             </Link>
//           </>
//         )}

//         {status === "error" && (
//           <>
//             <h2 className="text-3xl font-bold mb-6">VERIFICATION FAILED</h2>
//             <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
//               <p className="mb-4">{message}</p>
//               <p>If you're having trouble, please contact our support team.</p>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link href="/auth/signup">
//                 <button className="bg-gray-200 hover:bg-gray-300 text-black py-3 px-6 rounded-md text-sm uppercase w-full">
//                   TRY AGAIN
//                 </button>
//               </Link>
//               <Link href="/">
//                 <button className="bg-black/85 hover:opacity-70 text-white py-3 px-6 rounded-md text-sm uppercase w-full">
//                   GO TO HOME
//                 </button>
//               </Link>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
