// Configuração do login com o Google (Firebase Authentication).
// Estes valores NÃO são segredos: o Firebase os entrega ao navegador de qualquer site que usa o login.
// Eles vêm de variáveis NEXT_PUBLIC_* da Vercel. Sem elas, o site continua em modo "aberto" (sem login).
export const configFirebase = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const loginGoogleLigado = Boolean(configFirebase.apiKey && configFirebase.authDomain && configFirebase.projectId && configFirebase.appId);

/** Carrega o Firebase só quando preciso (a apresentação e o resto do site não pagam por ele). */
export async function carregarAuth() {
  const [{ getApp, getApps, initializeApp }, auth] = await Promise.all([import("firebase/app"), import("firebase/auth")]);
  const app = getApps().length ? getApp() : initializeApp(configFirebase);
  return { auth: auth.getAuth(app), ...auth };
}
