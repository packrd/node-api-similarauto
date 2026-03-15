import GetVehicleByPlate from "../../../../../../apis/node.fipe.js";

/* 
    curl -X POST http://localhost:7575/apis/v1/consult/vehicle/tech-sheet -d '{"plate":"dtt0539"}'
*/

export default async function POST({ res, body }) {
  const { plate } = (await body) || {};

  if (!plate)
    return res.end(
      JSON.stringify({
        status: false,
        error: "fail",
        message: "Informe a placa do veículo.",
      }),
    );

  const response = await GetVehicleByPlate(plate);

  console.log(response);

  if (!response?.brand || !response?.model || !response?.yearModel)
    return res.end(
      JSON.stringify({
        status: false,
        error: "fail",
        message: "Veículo não localizado pela placa",
      }),
    );

  return res.end(
    JSON.stringify({
      status: true,
      error: "success",
      data: response,
    }),
  );
}
