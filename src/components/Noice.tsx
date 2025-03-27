"use client";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { NoiceType } from "@/app/types/noice";
interface NoiceProps {
  noice: NoiceType;
}

export function Noice({ noice }: NoiceProps) {
  if (noice.type === "loading") {
    return (
      <div
        className={cn(
          "fixed z-[30000] inset-0 flex items-center justify-center bg-white",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div
          role="status"
          className={cn(
            "flex flex-col justify-center items-center gap-4",
            noice.styleType === "modal" && "z-50 bg-white p-5 lg:p-7 rounded-lg"
          )}
        >
          <div className="flex space-x-1 text-lg font-bold text-black">
            {"KipiCash".split("").map((char, index) => (
              <span
                key={index}
                className="inline-block font-extrabold animate-wave text-2xl lg:text-4xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
          <span className="ml-2 font-light text-gray-700 dark:text-gray-200">
            {noice.message || "Cargando..."}
          </span>
        </div>
      </div>
    );
  }

  if (noice.type === "error") {
    return (
      <div
        className={cn(
          "fixed  z-[30000] right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-white",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div className="flex flex-col items-center rounded-lg gap-y-4 py-4 px-10 bg-white shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] overflow-y-auto min-w-min">
          <h1 className="flex items-center text-2xl font-extrabold dark:text-white">
            Kipi
            <span className="bg-red-800 text-white text-2xl font-bold me-2 px-2.5 py-0.5 rounded-lg dark:bg-blue-200 ms-2">
              Crash :(
            </span>
          </h1>
          <div className="flex items-center justify-center min-w-16 min-h-16 rounded-[1.25rem] bg-red-800">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="flex flex-col items-center text-sm font-medium text-[#BC1C21] gap-y-4">
            {noice.message || "Algo ha salido mal, vuelve a intentarlo luego."}
          </p>
          <div className="w-2/3 flex flex-col items-center gap-y-2">
            <Button
              onClick={() => {
                window.location.reload();
              }}
              variant={"outline"}
              className="text-black px-4 py-2 rounded-lg w-full min-w-min hover:scale-105 transition-transform"
            >
              Volver a intentar
            </Button>
            <a className="w-full" href="/">
              <Button className="text-white bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg w-full hover:scale-105 transition-transform">
                Ir al inicio
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (noice.type === "success") {
    return (
      <div
        className={cn(
          "fixed  z-[30000] right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-white",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div className="flex flex-col items-center rounded-lg  gap-y-4 px-[18px] py-4 bg-white shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] aspect-square">
          <h1 className="flex items-start text-xl font-extrabold dark:text-white mr-10">
            Kipi
            <span className="bg-[#2e7d32] text-white text-xl font-bold me-2 px-2.5 py-0.5 rounded-lg dark:bg-blue-200 ms-2">
              Cash
            </span>
          </h1>
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2e7d32]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="flex flex-col items-center justify-center text-sm font-bold text-[#2e7d32] mt-3">
              {noice.message || "Todo salio bien."}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
