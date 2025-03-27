import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClientSessionProvider } from "@/components/ClientSessionProvider";
import { Redirect } from "@/components/Redirect";
import MiniKitProvider from "@/components/Minikit-Provider";
import NextAuthProvider from "@/components/next-auth-provider";
import { UserProvider } from "./user-context";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kipi Cash",
  description:
    "¡Convierte tus criptomonedas a soles de manera rápida, segura y sencilla! En Kipicash, conectamos a usuarios con agentes especializados para realizar cambios entre criptomonedas y soles peruanos en tiempo real. Diseñada para ofrecerte una experiencia personalizada, transparente y confiable, nuestra plataforma simplifica el proceso de intercambio y garantiza transacciones rápidas y seguras. ¿Por qué elegir Kipicash? Intercambio en minutos: Realiza tus cambios de criptomonedas a soles, de forma ágil y sin complicaciones. Agentes confiables: Conéctate directamente con agentes verificados que te guiarán durante todo el proceso. Tasas competitivas: Consulta cotizaciones actualizadas y tarifas claras antes de confirmar tu transacción. Seguridad garantizada: Tu tranquilidad es nuestra prioridad, por eso empleamos sistemas que protegen tus fondos en cada operación. Atención personalizada: Nuestro equipo está disponible para responder tus dudas y ayudarte en cada paso del intercambio. Cómo funciona Kipicash: 1. Inicia tu solicitud. 2. Sube una captura de la transacción al agente. 3. Espera a que el agente verifique tu transacción. 4. ¡Listo! Recibe tus soles en tu cuenta bancaria. ¡Regístrate y comienza a intercambiar tus criptomonedas hoy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MiniKitProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextAuthProvider>
              <UserProvider>{children}</UserProvider>
          </NextAuthProvider>

        </body>
      </MiniKitProvider>
    </html>
  );
}
