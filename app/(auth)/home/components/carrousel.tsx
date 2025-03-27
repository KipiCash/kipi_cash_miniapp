"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for featured promotions
const featuredItems = [
  {
    id: 1,
    title: "Compra Instantánea con WorldCoins",
    description:
      "Usa tus WorldCoins para comprar productos en nuestro marketplace al instante y sin complicaciones.",
    cta: "Comprar Ahora",
    bgColor: "from-blue-500 to-indigo-700",
  },
  {
    id: 2,
    title: "Descubre Colecciones Exclusivas",
    description:
      "Explora colecciones únicas disponibles solo en nuestro marketplace y adquiere artículos exclusivos antes que nadie.",
    cta: "Explorar Colecciones",
    bgColor: "from-purple-500 to-pink-600",
  },
  {
    id: 3,
    title: "Beneficios Exclusivos con Cripto Pagos",
    description:
      "Disfruta de ofertas y descuentos exclusivos al pagar con criptomonedas en nuestro marketplace.",
    cta: "Ver Ofertas",
    bgColor: "from-green-500 to-emerald-700",
  },
];

export default function Carrousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featuredItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredItems.length - 1 : prev - 1
    );
  };

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute left-2 sm:left-4 top-1/2 z-10 -translate-y-1/2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
      </div>
      <div className="absolute right-2 sm:right-4 top-1/2 z-10 -translate-y-1/2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 backdrop-blur"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>

      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {featuredItems.map((item) => (
          <Card
            key={item.id}
            className={`min-w-full rounded-xl bg-gradient-to-r ${item.bgColor} text-white min-h-[180px] sm:min-h-[140px]`}
          >
            <CardContent className="flex flex-col items-start justify-between gap-4 p-4 sm:p-6 sm:px-8 sm:flex-row sm:items-center ">
              <div className="space-y-2">
                <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
                  {item.title}
                </h2>
                <p className="text-sm max-w-md text-white/90 sm:text-base">
                  {item.description}
                </p>
              </div>
              <Button className="mt-2 w-full sm:w-auto shrink-0 bg-white text-black hover:bg-white/90">
                {item.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {featuredItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
