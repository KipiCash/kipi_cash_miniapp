"use client";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-slate-200 via-slate-200 to-gray-300">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white">
        {children}
      </div>
    </div>
  );
}
