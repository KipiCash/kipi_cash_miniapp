"use client";

import { useState } from "react";
import type { Item } from "@/db/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ProductsSectionProps {
  items: Item[];
}

export default function ProductsSection({ items }: ProductsSectionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="mt-6">
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Productos</h2>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-gray-600"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrar por
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Ordenar por</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">
                  Precio: Mayor a Menor
                </SelectItem>
                <SelectItem value="name">Nombre</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-none rounded-l-md"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-none rounded-r-md"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 gap-y-2"
          } gap-4`}
        >
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <Link key={item.id} href={`/home/item/${item.id}`}>
                <Card className="hover:shadow-md transition-shadow border-0">
                  <CardContent
                    className={`p-0 ${viewMode === "list" ? "flex" : ""}`}
                  >
                    <div
                      className={`bg-gray-100 ${
                        viewMode === "list"
                          ? "w-24 h-24"
                          : "aspect-square w-full"
                      } relative`}
                    >
                      <img
                        src={
                          item.imageImgLink ||
                          "/placeholder.svg?height=200&width=200"
                        }
                        alt={item.name}
                        // fill
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <div
                      className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      <p className="text-sm font-medium line-clamp-2">
                        {item.name}
                      </p>
                      <p className="font-semibold mt-1 text-primary">
                        S/ {item.price.toFixed(2)}
                      </p>
                      {viewMode === "list" && item.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center py-8 text-gray-500">
              No hay productos en esta tienda
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
