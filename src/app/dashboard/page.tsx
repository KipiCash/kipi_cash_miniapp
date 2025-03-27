"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
export default function Page() {
  const { status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div
        className="text-black flex cursor-pointer h-auto w-64 items-center justify-center rounded-md border border-gray-300 px-4 py-2"
        onClick={() => {
          signOut();
        }}
      >
        LogOut
      </div>
    </div>
  );
}
