"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, HeadsetIcon } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="flex items-center text-5xl font-extrabold dark:text-white">
              Kipi
              <span className="bg-slate-900 text-white text-5xl font-bold me-2 px-2.5 py-0.5 rounded-lg dark:bg-blue-200 ms-2">
                Cash
              </span>
            </h1>
          </div>
          {status === "unauthenticated" && (
            <Link href="/auth/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
          )}
          {status === "authenticated" && (
            <Button onClick={
              () => {
              signOut({ redirect: true });
              }
            } className="bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
              Cerrar Sesión
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Cambia <span className="text-blue-600">Worldcoin</span> a <span className="text-blue-600">Soles</span>, directo a tu cuenta
            </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            La forma más rápida y segura de convertir tus criptomonedas en
            efectivo. Recibe tu dinero en tu banco sin complicaciones.
          </p>
          <Link href="/auth/walletauth">
            <Button size="lg" className="bg-slate-900  hover:bg-slate-700">
              ¡Empecemos! <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-[#d7e3ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#2a4076]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Seguridad Comprobada
              </h3>
              <p className="text-gray-600">
                Protegemos cada paso de tu transacción con los más altos
                estándares de seguridad.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#d7e3ff]  w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#2a4076]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Conversión Inmediata
              </h3>
              <p className="text-gray-600">
                Recibe soles en tu cuenta bancaria en cuestión de minutos.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#d7e3ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadsetIcon className="h-8 w-8 text-[#2a4076]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Soporte a Tu Medida
              </h3>
              <p className="text-gray-600">
                Te acompañamos antes, durante y después de cada operación.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
