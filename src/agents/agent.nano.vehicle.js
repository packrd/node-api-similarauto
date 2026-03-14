export const AgentNanoVehicle = (str) => {
  const prompt = `Analise o texto e retorne SOMENTE um JSON válido. Nunca explique. Nunca retorne texto fora do JSON.

Formato obrigatório:

{
  "charkeys": ["string"]
}

Regras:

- Identifique a peça automotiva mencionada ou problema descrito no texto.
- Considere o veículo (quando mencionado) apenas para especificar compatibilidade.
- Gere até 6 palavras-chave específicas relacionadas SOMENTE à peça.
- Nunca use termos curtos ou genéricos.
- Não gere materiais, partes internas ou termos genéricos.
- Remova conectivos da língua.
- Evite repetir palavras-chave ou termos específicos.`;

  return [
    {
      role: "system",
      content: "Você é um agente especialista em veículos.",
    },
    { role: "user", content: `${prompt}\n\n"${str}` },
  ];
};
