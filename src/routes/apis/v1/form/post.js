import DataSheets from "../../../../databaase/node.api.sheets.js";

export default async function POST({ res, body }) {
  const data = await body;

  const dataSheetsInsert = await DataSheets("/api/v1/put", {
    projectId: "similarauto",
    sheetId: "1gGcW7P2y9Ba2a_2WD03AHp6ztxfF88zA3Ed-7umRPCU",
    ...data,
  });

  res.end(
    JSON.stringify({
      status: dataSheetsInsert?.status || false,
      error: dataSheetsInsert?.error || "fail",
    }),
  );
}
