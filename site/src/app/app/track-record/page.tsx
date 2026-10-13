import type { Metadata } from "next";
import { atlas } from "@/lib/atlas";
import { Placar } from "@/components/Placar";
import { compararComLinhaDeBase, diasDoPeriodo } from "@/lib/linhaDeBase";
import type { Janela } from "@/lib/tipos";
import vivo from "../../../../public/data/janelas_ao_vivo.json";

export const metadata: Metadata = { title: "Track record — Nomos" };

export default function Page() {
  // Linha de base ingênua nas mesmas janelas ao vivo (todas as publicadas, não só as mostradas por usina)
  const calor = Object.fromEntries(atlas.usinas.map((u) => [u.id, u.calor]));
  const linhaDeBase = compararComLinhaDeBase(vivo.janelas as unknown as Janela[], calor);
  return (
    <Placar
      d={{
        teste: atlas.teste,
        manchete: atlas.manchete,
        impressoes: atlas.impressoes,
        ao_vivo: atlas.ao_vivo,
        razoes: atlas.razoes,
        dados_ate: atlas.dados_ate,
        dias_ao_vivo: diasDoPeriodo(atlas.ao_vivo.periodo),
        linha_de_base: linhaDeBase,
        usinas: atlas.usinas.map(({ id, nome, uf, tipo, teste, placar, placar_ao_vivo }) => ({ id, nome, uf, tipo, teste, placar, placar_ao_vivo })),
      }}
    />
  );
}
