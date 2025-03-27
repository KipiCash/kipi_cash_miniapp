import React from "react";

export const LoadingPage = () => {
  return (
    <div className="w-screen h-screen absolute top-0 right-0 flex flex-col items-center justify-center z-50 bg-white bg-opacity-90">
      <div className="flex space-x-1 text-2xl font-bold text-black">
        {"KipiCash".split("").map((char, index) => (
          <span
            key={index}
            className="inline-block animate-wave text-6xl"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
};
