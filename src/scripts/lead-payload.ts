// Mapeamento normalizado para o padrão exato de chaves do n8n.
// Compartilhado entre forms.ts (LeadForm) e WhatsAppWidget para que
// todo formulário do site envie os mesmos nomes de campo ao webhook.
export const keyMap: Record<string, string> = {
  nome: 'Nome',
  email: 'E-mail',
  'e-mail': 'E-mail',
  telefone: 'WhatsApp',
  whatsapp: 'WhatsApp',
  data: 'Data do evento',
  data_evento: 'Data do evento',
  'data do evento': 'Data do evento',
  tipo_evento: 'Tipo de evento',
  'tipo de evento': 'Tipo de evento',
  convidados: 'Convidados',
  empresa: 'Empresa',
  mensagem: 'Mensagem',
};

export const trackingParamKeys = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
  'utm_content', 'utm_id', 'gclid', 'gbraid', 'wbraid',
  'fbclid', 'ttclid', 'msclkid', 'sck',
  'fbc', 'fbp', 'external_id', 'event_id',
];

// Deriva "Landing page/<slug>" a partir da URL atual, sem precisar configurar
// nada manualmente por página. A home (slug vazio) é a landing de casamentos.
export function getPageSource(pathname: string): string {
  const slug = pathname.replace(/\/$/, '').split('/').filter(Boolean)[0];
  return `Landing page/${slug || 'casamentos'}`;
}
