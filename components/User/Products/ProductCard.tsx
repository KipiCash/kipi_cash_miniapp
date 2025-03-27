import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number | null;
    imagen_url: string | null;
  };
  addToCart: (productId: number) => void;
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
  console.log(product);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{product.descripcion}</p>
        <p className="font-bold mt-2">Precio: S/{product.precio}</p>
        {product.stock && product.stock > 0 ? (
          <p className="text-green-600 mt-1">En stock: {product.stock}</p>
        ) : (
          <p className="text-red-600 mt-1">Agotado</p>
        )}
        {product.imagen_url && (
          <img
            src={product.imagen_url}
            alt={product.nombre}
            width={96}
            height={96}
          />
        )}
        <Button
          onClick={() => addToCart(product.id)}
          className="mt-4 w-full"
          disabled={!product.stock || product.stock <= 0}
        >
          Agregar al carrito
        </Button>
      </CardContent>
    </Card>
  );
}
