"use client";

import WalletAuthBlock from "@/components/WalletAuthBlock";
import { useUser } from "./user-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function LoginPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Kipi Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Conecta tu wallet para comenzar a comprar y vender en el marketplace
          </p>
        </div>

        <WalletAuthBlock />

        <p className="text-center text-sm text-muted-foreground">
          Al conectar tu wallet, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}
