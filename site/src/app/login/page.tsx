import type { Metadata } from "next";
import { Suspense } from "react";
import { Login } from "@/components/Login";

export const metadata: Metadata = { title: "Entrar — Nomos" };

// Segunda parada do fluxo: o login. A página lê ?from= no navegador; o Suspense é exigido para isso com Cache Components
export default function Page() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}
