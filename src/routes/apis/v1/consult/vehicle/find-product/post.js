import ChatApplication from "../../../../../../apis/node.gpt.js";
import { AgentNanoVehicle } from "../../../../../../agents/agent.nano.vehicle.js";
import DataSheets from "../../../../../../databaase/node.api.sheets.js";
import normalize from "../../../../../../helpers/normalize.js";
import { stopWords } from "../../../../../../helpers/stopWords.js";

/* 
    curl -X POST http://localhost:7575/apis/v1/consult/vehicle/find-product -d '{"query":"Farol alto do ford fiesta 2007"}'
*/

export default async function POST({ res, body }) {
  const { query } = (await body) || {};
  //const query = "Farol alto do ford fiesta 2007";
  if (!query)
    return res.end(
      JSON.stringify({
        status: false,
        error: "fail",
        message: "Informe a peça desejada ou problema do veículo.",
      }),
    );

  let filter = [];
  let search = query;

  /* let agentPrompt = await ChatApplication({
    message: AgentNanoVehicle(query),
  });

  if (agentPrompt?.data && agentPrompt?.status) {
    search = JSON.parse(agentPrompt?.data?.content || "[]") || [];
    search = search.charkeys.join(" ");
  } */

  const responseDataSheetsProducts = await DataSheets("/api/v1/consult/all", {
    projectId: "similarauto",
    sheetId: "1gGcW7P2y9Ba2a_2WD03AHp6ztxfF88zA3Ed-7umRPCU",
    sheetLabel: "products",
  });

  if (
    responseDataSheetsProducts?.status &&
    responseDataSheetsProducts?.data?.[0]
  ) {
    let tokens = search
      .split(/[ ,.-]+/)
      .map((t) => normalize(t.trim()))
      .filter((t) => t && t.length > 1 && !stopWords.includes(t));

    tokens = [...new Set(tokens)];

    filter = responseDataSheetsProducts?.data
      .map((item) => {
        const keys = item.charkeys?.split(",").map((k) => normalize(k.trim()));

        const score = tokens.reduce((acc, token) => {
          const match = keys?.some(
            (key) => key.includes(token) || token.includes(key),
          );
          return match ? acc + 1 : acc;
        }, 0);

        return { ...item, score };
      })
      .filter((item) => item.score >= 1)
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...rest }) => rest);
  }

  return res.end(
    JSON.stringify({
      status: filter?.[0] ? true : false,
      error: filter?.[0] ? "success" : "not-result",
      message: filter?.[0] ? "" : "Nenhum resultado encontrado",
      data: filter,
    }),
  );
}
