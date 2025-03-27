"use client";

import Link from "next/link";
import { ShoppingCart, Menu, Store, ArrowLeft } from "lucide-react";
import { getCookieCart } from "@/app/(auth)/cart/actions";
import { usePathname, useRouter } from "next/navigation";

export function TopBar() {
  const cookieCart = getCookieCart();
  const pathname = usePathname();
  const router = useRouter();

  const mainRoutes = ["/home", "/orders", "/profile"];
  const showBackArrow = !mainRoutes.includes(pathname);

  const getTotalCount = () => {
    let items = 0;
    Object.values(cookieCart).forEach((value) => {
      items += value as number;
    });
    return items;
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 border-b bg-background z-10">
      <div className="flex items-center">
        {showBackArrow && (
          <button onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
        <Link href="/home" className="flex items-center">
          <Store className="h-6 w-6" />
          <span className="ml-2 font-semibold">KipiMarketplace</span>
        </Link>
      </div>
      <div className="flex items-center">
        <Link href="/cart" className="relative">
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {getTotalCount()}
          </span>
        </Link>
      </div>
    </div>
  );
}
