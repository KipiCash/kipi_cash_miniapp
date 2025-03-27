import { getStoreById } from "@/db/store";
import { getItemsByStore } from "@/db/item";
import { getCategoryById } from "@/db/category";
import StoreHeader from "./StoreHeader";
import ProductsSection from "./ProductsSection";

export default async function StorePage({
  params,
}: {
  params: { id: string };
}) {
  const storeId = params.id;

  const store = await getStoreById(storeId);
  const items = await getItemsByStore(storeId);
  const categoriesPromises = store.categoryIds.map(async (id) => {
    try {
      return await getCategoryById(id);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return { id, name: "Categoría" };
    }
  });

  const categories = await Promise.all(categoriesPromises);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <StoreHeader store={store} categories={categories} />
        <ProductsSection items={items} />
      </div>
    </div>
  );
}
