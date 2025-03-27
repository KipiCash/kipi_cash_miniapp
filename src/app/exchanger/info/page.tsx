"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { NoiceType } from "@/app/types/noice";
import { Noice } from "@/components/Noice";
import { ButtonAnimated } from "@/components/ButtonAnimated";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/db/users";

interface ErrorChange {
  noWal?: string;
}

export default function Page() {
  const { data: session } = useSession();
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [wal, setWal] = useState<string | null>(
    session?.user.walletAddress || ""
  );
  const [error, setError] = useState<ErrorChange>({});
  const [noice, setNoice] = useState<NoiceType | null>(null);

  useEffect(() => {
    if ((error.noWal && wal) || !onEdit) {
      setError({});
    }
  }, [wal, onEdit]);

  const onUpdate = async () => {
    const new_error = {} as ErrorChange;

    if (!wal) {
      new_error.noWal = "No ha ingresado su dirección de billetera";
    }

    if (Object.keys(new_error).length > 0) {
      setError(new_error);
      return;
    }

    setNoice({
      type: "loading",
      message: "Actualizando Dirección de Billetera...",
      styleType: "modal",
    });

    try {
      if (!session) throw new Error("No hay sesión activa");
      await updateUser({
        userId: session.user.id,
        role: session.user.role!,
        walletAddress: wal!,
      });

      setNoice({
        type: "success",
        message: "Dirección de Billetera actualizada correctamente",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setNoice(null);
          setOnEdit(false);
          resolve();
          window.location.reload();
        }, 2000);
      });
    } catch (error) {
      console.error(error);
      setNoice({
        type: "error",
        message: "Ha ocurrido un error al actualizar su billetera",
      });
    }
  };

  return (
    <div className="w-full p-4">
      {noice && <Noice noice={noice} />}
      <span className="text-2xl font-bold">Información del Cambista</span>
      <div className="grid md:grid-cols-2 gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-full md:w-2/3">
              <span className="text-lg font-bold self-start ml-4">Nombre</span>
              <div className="h-1 bg-slate-900 bg-opacity-85 mr-6 rounded-full" />
            </div>
            <span className="text-lg ml-6">{session?.user.name}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full md:w-2/3">
              <span className="text-lg font-bold self-start ml-4">Correo</span>
              <div className="h-1 bg-slate-900 bg-opacity-85 mr-6 rounded-full" />
            </div>
            <span className="text-lg ml-6">{session?.user.email}</span>
          </div>
        </div>
        {session?.user.role === "exchanger" && session.user.walletAddress && (
          <div className="w-full flex flex-col">
            <div className="flex justify-between">
              <span className="text-lg font-bold ml-4">
                Dirección de Billetera
              </span>
              <div className="mr-8 md:w-1/2">
                <div
                  className="relative group inline-block cursor-pointer"
                  onClick={() => setOnEdit(true)}
                >
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-900 bg-opacity-95 text-white text-sm px-2 py-1 rounded opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    Editar
                  </span>
                  <Pencil1Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="h-1 bg-slate-900 bg-opacity-85 mr-6 my-2 rounded-full md:w-1/2" />
            {!onEdit ? (
              <>
                <span className="text-lg ml-6">
                  {session.user.walletAddress}
                </span>
                {error.noWal && (
                  <p className="text-red-600 text-sm">{error.noWal}</p>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center mx-6 lg:w-1/2">
                <p className="text-lg font-bold text-gray-800">
                  Introduzca su dirección de billetera
                </p>
                <Input
                  type="text"
                  value={wal || ""}
                  onChange={(e) => setWal(e.target.value)}
                  className="px-4 py-2 border rounded-md w-full"
                  placeholder="Dirección de billetera"
                />
                {error.noWal && (
                  <p className="text-red-600 text-sm">{error.noWal}</p>
                )}
                <div className="grid md:grid-cols-2 w-full px-12 md:p-0 md:w-1/2 gap-4 mt-4">
                  <ButtonAnimated
                    variant="default"
                    onClick={onUpdate}
                    text="Guardar"
                    className="hover:bg-green-500 bg-green-900 text-white"
                  />
                  <ButtonAnimated
                    variant="destructive"
                    text="Cancelar"
                    onClick={() => {
                      setOnEdit(false);
                      setWal(null);
                    }}
                    className="bg-red-500 text-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
