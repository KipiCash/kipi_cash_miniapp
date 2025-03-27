"use client";

import { useUser } from "../../user-context";
import WalletAuthBlock from "@/components/WalletAuthBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Settings, ShoppingBag, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold">Perfil</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
        {!user?.username ? (
          <WalletAuthBlock />
        ) : (
          <>
            {/* Perfil del usuario */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Información del Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.profilePictureUrl || ""} />
                    <AvatarFallback className="text-lg">
                      {user.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{user.username}</h2>
                    <p className="text-sm text-muted-foreground">
                      Miembro desde 2025
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Estadísticas del usuario */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Compras</p>
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="text-lg font-medium">12</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4" />
                      <span className="text-lg font-medium">2.5 WLD</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="space-y-4">
              <Button className="w-full" variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Mis Compras
              </Button>
              <Button className="w-full" variant="outline">
                <Wallet className="mr-2 h-4 w-4" />
                Gestionar Wallet
              </Button>
              <Button className="w-full" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
