"use client";

import { ClipboardList, Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  {
    name: "Inicio",
    href: "/home",
    icon: Home,
  },
  {
    name: "Pedidos",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    name: "Perfil",
    href: "/profile",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t h-20 pb-6 pt-3">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 group",
                isActive && "text-primary"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 mb-1 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              />
              <span
                className={cn(
                  "text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
