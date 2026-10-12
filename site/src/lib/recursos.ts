// Interruptores de exibição. Nada foi apagado: o que está desligado só deixou de aparecer no caminho principal.
// Para mostrar de novo, troque false por true (e rode npm run build). A reserva demonstrativa agora vive em /lab.

export const MOSTRAR: {
  reservaNoAtlas: boolean;
  horasDeGpu: boolean;
  visaoFuturaNoInicio: boolean;
  abaVerificar: boolean;
} = {
  /** Botões "Reservar (demo)" e "Replay" no Início e nas páginas de usina. */
  reservaNoAtlas: false,
  /** "Horas de GPU" na tabela de janelas do Início (e a nota sobre elas no Método). */
  horasDeGpu: false,
  /** Bloco roxo "Visão futura, simulada" do Início. */
  visaoFuturaNoInicio: false,
  /** Aba "Verificar" no cabeçalho (a página /verify continua existindo). */
  abaVerificar: false,
};
