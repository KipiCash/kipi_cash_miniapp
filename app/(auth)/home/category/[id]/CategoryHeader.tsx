"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List } from "lucide-react";

interface CategoryHeaderProps {
  categoryName: string;
  itemCount: number;
}

export default function CategoryHeader({
  categoryName,
  itemCount,
}: CategoryHeaderProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{categoryName}</h1>
        <p className="text-sm text-muted-foreground">{itemCount} items</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select defaultValue="default">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Filtrar por</SelectItem>
              <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="name">Nombre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="default">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Ordenar</SelectItem>
              <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
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
    </div>
  );
}
