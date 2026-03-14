export default async function ChatApplication({ message = [] }) {
  if (!Array.isArray(message) || message.length === 0) {
    return buildError("invalid-message", "Nenhuma mensagem escrita");
  }

  try {
    const response = await fetch(
      "https://gen.pollinations.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_POLLINATIONS_AI}`,
          Accept: "*/*",
        },
        body: JSON.stringify({
          model: "openai",
          messages: message,
          cache_control: {
            type: "ephemeral",
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      status: true,
      error: null,
      message: "Resposta iniciada",
      data: {
        type: "text",
        content: data?.choices?.[0]?.message?.content,
      },
    };
  } catch (error) {
    console.error("ChatApplication error:", error?.message);
    return ChatApplicationFallback({ message });
  }
}

/**
 * Fallback simples (endpoint /text)
 */
async function ChatApplicationFallback({ message = [] }) {
  if (!Array.isArray(message) || message.length === 0) {
    return buildError("invalid-message", "Nenhuma mensagem escrita");
  }

  try {
    const prompt = message
      .map(({ role, content }) => `${role}: ${content}`)
      .join("\n");

    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://gen.pollinations.ai/text/${encodedPrompt}?key=${process.env.API_POLLINATIONS_AI}`;

    const response = await fetch(url);

    const ok = [200, 202].includes(response.status);

    if (!ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();

    return {
      status: true,
      error: null,
      message: "Resposta recebida com sucesso",
      data: { type: "text", content: text },
    };
  } catch (error) {
    console.error("ChatApplicationFallback error:", error?.message);
    return buildError("bad-request", "Falha ao executar resposta");
  }
}

function buildError(error, message) {
  return {
    status: false,
    error,
    message,
    data: null,
  };
}
