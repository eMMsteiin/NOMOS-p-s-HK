// Endereços internos do site.
// O fluxo é: apresentação (/) → login (/login) → plataforma (/app e o que fica dentro dela).
export const ROTAS = {
  inicio: "/",
  entrar: "/login",
  plataforma: "/app",
  usina: (id: string) => `/app/plants/${id}`,
  calculadora: (id: string) => `/app/plants/${id}#calculadora`,
  placar: "/app/track-record",
  metodo: "/app/method",
  laboratorio: "/app/lab",
  verificar: "/app/verify",
  verificarTx: (tx: string) => `/app/verify?tx=${tx}`,
} as const;
