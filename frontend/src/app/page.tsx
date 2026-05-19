"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
      <div className="flex flex-col items-center space-y-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
        <span className="text-xs text-gray-400 tracking-wide font-medium">
          Initializing Workspace...
        </span>
      </div>
    </div>
  );
}
