"use client";

import { useUser } from "@/app/user-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { getCategories } from "@/db/category";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Carrousel from "./components/carrousel";
import Image from "next/image";

interface CategoryImage {
  id: string;
  name: string;
  description: string;
  href: string;
  imgLink: string | null;
}

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [categoriesImages, setCategoriesImages] = useState<CategoryImage[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        const images = fetchedCategories.map((category: any) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          href: `/home/category/${category.id}`,
          imgLink: category.imgLink || null,
        }));
        setCategoriesImages(images);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, [router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
      <Carrousel />
      <section>
        <h2 className="text-2xl font-bold">Categorías</h2>
        <p className="text-sm text-gray-400">
          Explora y descubre productos especializados en cada categoría
          cuidadosamente organizada.
        </p>
      </section>
      <div className="grid grid-cols-1 gap-4">
        {categoriesImages.length > 0 ? (
          categoriesImages.map((category) => (
            <Link key={category.id} href={category.href}>
            <Card
              className="overflow-hidden transition-all duration-300 ease-in-out rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 bg-white"
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Encabezado */}
              <CardHeader className="flex flex-col items-center text-center p-4">
              </CardHeader>

              {/* Contenido */}
              <CardContent className="flex flex-col items-center text-center gap-2 p-4">
                {category.imgLink ? (
                  <img
                    src={category.imgLink || ""}
                    alt={category.name}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                ) : (
                  <Sparkles className="h-14 w-14 text-primary" />
                )}
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </CardContent>

              {/* Footer */}
              <CardFooter className="flex justify-center p-4">
                <button
                  className="flex items-center gap-2 text-sm font-medium text-primary transition-transform duration-300 hover:translate-x-1 hover:text-primary-dark"
                >
                  Explorar
                  <ArrowRight
                    className={`h-4 w-4 transition-transform duration-300 ${
                      hoveredCard === category.id ? "translate-x-1.5" : ""
                    }`}
                  />
                </button>
              </CardFooter>
            </Card>
            </Link>
          ))
        ) : (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        )}
      </div>
    </div>
  );
}
