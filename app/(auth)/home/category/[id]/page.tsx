import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getCategoryById } from "@/db/category";
import { Item } from "@/db/types";
import { getItemsByCategory } from "@/db/item";
import CategoryHeader from "./CategoryHeader";

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategoryById(params.id);

  const items = await getItemsByCategory(category.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryHeader categoryName={category.name} itemCount={items.length} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        {items.length > 0 ? (
          items.map((item: Item) => (
            <Link key={item.id} href={`/home/item/${item.id}`}>
              <Card className="hover:shadow-lg transition-shadow border-0">
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    <div className="bg-gray-200 aspect-square w-full relative">
                      <img
                        src={item.imageImgLink || ""}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="font-semibold mt-1">
                        S/.{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center py-8 text-muted-foreground">
            No hay ítems en esta categorías
          </p>
        )}
      </div>
    </div>
  );
}
