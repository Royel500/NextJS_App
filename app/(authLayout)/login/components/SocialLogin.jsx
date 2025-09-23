"use client";

import { FaGoogle } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SocialLogin() {
  const router = useRouter();
  const { status } = useSession();
  const [redirected, setRedirected] = useState(false); // prevent double redirect

  const handleSocialLogin = async (providerName) => {
    // Use callbackUrl so OAuth redirect lands on homepage
    await signIn("google", { callbackUrl: "/" })
  };

  useEffect(() => {
    if (status === "authenticated" && !redirected) {
      setRedirected(true); // prevent multiple pushes
      router.push("/"); // client-side redirect
      toast.success("Successfully Logged In");
    }
    // skip loading or unauthenticated
  }, [status, redirected]);

  return (
    <div className="flex justify-center gap-8">
      <button
        onClick={() => handleSocialLogin("google")}
        className="bg-slate-200 rounded-full p-3"
      >
        <FaGoogle size={24} />
      </button>
    </div>
  );
}
