const CNPJ_BASE = "https://brasilapi.com.br/api/cnpj/v1/";

export default async function GetCNPJ(cnpj) {
  try {
    const normalizedCnpj = String(cnpj).replace(/\D/g, "");
    const res = await fetch(`${CNPJ_BASE}${normalizedCnpj}`, {
      headers: {
        "User-Agent": "similarauto-app",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erro ${res.status}: ${text}`);
    }

    return await res.json();
  } catch (Err) {
    console.log(Err);
    return null;
  }
}
