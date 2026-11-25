// Campanhas sazonais do site: blocos temporários que entram e saem das páginas.
// Para encerrar antes do prazo, basta trocar `ativa` para false e publicar.
// Depois de `ate`, o bloco deixa de ser gerado no build e some sozinho no
// navegador de quem abrir uma versão publicada antes dessa data.

export interface Campanha {
  ativa: boolean;
  /** Último dia no ar (AAAA-MM-DD, horário de São Paulo). */
  ate: string;
}

export const kickoff2027: Campanha = {
  ativa: true,
  ate: '2027-02-28',
};

/** Momento em que a campanha expira: virada do dia seguinte a `ate`, em São Paulo (UTC-3). */
export function expiraEm(c: Campanha): number {
  return Date.parse(`${c.ate}T23:59:59-03:00`);
}

export function campanhaNoAr(c: Campanha): boolean {
  return c.ativa && Date.now() <= expiraEm(c);
}
