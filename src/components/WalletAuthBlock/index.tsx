"use client";

import React, { useEffect, useState } from "react";
import {
  MiniKit,
  WalletAuthInput,
  MiniAppWalletAuthSuccessPayload,
} from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/user-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Loader2, XCircle, Wallet } from "lucide-react";
import { getClientByWallet, setClient } from "@/db/client";

export const WalletAuthBlock: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (
        MiniKit.isInstalled() &&
        MiniKit.user &&
        MiniKit.user.username &&
        MiniKit.walletAddress
      ) {
        const client = await getClientByWallet(MiniKit.walletAddress);
        if (client) {
          setUser(MiniKit.user);
        } else {
          const newClient = {
            username: MiniKit.user.username,
            wallet: MiniKit.walletAddress,
          };
          await setClient(newClient, MiniKit.walletAddress);
          setUser(MiniKit.user);
        }
      }
    }
    fetchData();
  }, [setUser]);

  const signInWithWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!MiniKit.isInstalled()) {
        setError(
          "WorldApp no está instalado. Por favor, instala WorldApp para continuar."
        );
        return;
      }

      setStatus("Obteniendo nonce...");

      const res = await fetch("/api/nonce");
      if (!res.ok) {
        throw new Error("Error al obtener el nonce");
      }

      const { nonce } = await res.json();

      setStatus("Firmando mensaje con la wallet...");
      const { commandPayload: generateMessageResult, finalPayload } =
        await MiniKit.commandsAsync.walletAuth({
          nonce: nonce,
          expirationTime: new Date(
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000
          ),
          notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          statement:
            "Este mensaje confirma tu identidad en nuestra aplicación. Al firmar, estás autorizando el acceso seguro a tu cuenta.",
        } as WalletAuthInput);

      if (finalPayload.status === "error") {
        setError(`Error en wallet auth: ${finalPayload.details}`);
        return;
      } else {
        setStatus("Wallet autenticada exitosamente");

        const maxAttempts = 10;
        let attempts = 0;
        const intervalId = setInterval(async () => {
          attempts++;
          if (MiniKit.user && MiniKit.user.username && MiniKit.walletAddress) {
            console.log("User data:", MiniKit.user);
            clearInterval(intervalId);

            const client = await getClientByWallet(MiniKit.walletAddress);
            if (!client) {
              const newClient = {
                username: MiniKit.user.username,
                wallet: MiniKit.walletAddress,
              };
              await setClient(newClient, MiniKit.walletAddress);
              setUser({ ...MiniKit.user, ...newClient });
            } else {
              setUser({ ...MiniKit.user, ...client });
            }
            router.push("/home");
          } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            setError(
              "No se pudo obtener la información del usuario después de varios intentos"
            );
          }
        }, 1000);

        await completeSiwe(
          finalPayload as MiniAppWalletAuthSuccessPayload,
          nonce
        );
      }
    } catch (err) {
      console.error("Error during wallet authentication:", err);
      setError(
        `Error durante la autenticación: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setIsLoading(false);
    }
  };

  const completeSiwe = async (
    payload: MiniAppWalletAuthSuccessPayload,
    nonce: string
  ) => {
    try {
      setStatus("Verificando autenticación en backend...");
      const response = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, nonce }),
      });

      if (!response.ok) {
        throw new Error(
          `Error en la respuesta del servidor: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.status === "success" && data.isValid) {
        setStatus("Autenticación verificada exitosamente");
        router.push("/home");
      }
    } catch (err) {
      console.error("Error completing SIWE verification:", err);
      setError(
        `Error en la verificación: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Wallet Auth</CardTitle>
        <CardDescription>
          Inicia sesión con tu wallet a través de WorldApp
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {status || "Procesando..."}
            </p>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            <div className="rounded-lg border p-3 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Conecta tu wallet para acceder a todas las funcionalidades de la
                aplicación.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          onClick={signInWithWallet}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Conectar Wallet
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletAuthBlock;
