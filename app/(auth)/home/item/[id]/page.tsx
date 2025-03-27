import { getItemById } from "@/db/item";
import { getStoreById } from "@/db/store";
import ItemDetailView from "./ItemDetailView";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const itemId = params.id;
  const item = await getItemById(itemId);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">Producto no encontrado</div>
    );
  }

  const store = await getStoreById(item.storeId);

  return (
    <div className="min-h-screen bg-background">
      <ItemDetailView
        item={item}
        storeName={store?.name || "Tienda"}
        storeId={store.id || ""}
      />
    </div>
  );
}
