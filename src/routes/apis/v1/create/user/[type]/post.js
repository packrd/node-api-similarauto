import GetCNPJ from "../../../../../../apis/node.cnpj.brasilapi.js";
import DataSheets from "../../../../../../databaase/node.api.sheets.js";
import { entiesProfileData } from "../../../../../../enties/enties.profile.data.js";

// curl -X POST http://localhost:7575/apis/v1/create/user/mechanic -d '{"phone":"(11)97789-9009","fullName":"Rodrigo Buttura","email":"contato@gmail.coms","document":"52.995.124/0001-58"}'

export default async function POST({ res, body, keys }) {
  const data = await body;
  const { type } = await keys;
  let getCNPJ = await GetCNPJ(data?.document);

  if (
    !data?.document ||
    !data?.phone ||
    !data?.email ||
    !data?.fullName ||
    !data?.documentProprietary ||
    !type ||
    !/mechanic|supplier/.test(type) ||
    !getCNPJ?.cnpj
  )
    return res.end(
      JSON.stringify({
        status: false,
        error: "not-permission",
        message: "Verifique se os dados foram preenchidos corretamente",
      }),
    );

  data[type === "mechanic" ? "mechanicData" : "supplierData"] = {
    socialName: getCNPJ?.razao_social,
    document: getCNPJ?.cnpj,
    address: getCNPJ?.getCNPJ,
    neighborhood: getCNPJ?.bairro,
    city: getCNPJ?.municipio,
    number: getCNPJ?.numero,
    complement: getCNPJ?.complemento,
    codePostal: getCNPJ?.cep,
    country: getCNPJ.pais || "Brasil",
    cnae: getCNPJ?.cnae_fiscal,
    createdAtSocial: getCNPJ?.data_situacao_cadastral,
    statusSocial: getCNPJ?.descricao_situacao_cadastral,
    socialData: getCNPJ?.qsa,
  };

  data[type === "mechanic" ? "isMechanic" : "isSupplier"] = true;
  data.permission = "off";

  let phoneWhatsApp = data?.phone?.replace(/\D/gi, "");
  phoneWhatsApp = `55${phoneWhatsApp}@c.us`;

  const hasClient = await DataSheets("/api/v1/consult/column", {
    projectId: "similarauto",
    sheetLabel: "users",
    sheetId: "1gGcW7P2y9Ba2a_2WD03AHp6ztxfF88zA3Ed-7umRPCU",
    filters: [{ column: "user", search: phoneWhatsApp }],
  });

  if (hasClient?.data?.[0])
    return res.end(
      JSON.stringify({
        status: false,
        error: "has-client",
        message: "Cliente já cadastrado",
      }),
    );

  const entiesData = entiesProfileData({ data });

  const createClient = await DataSheets("/api/v1/put", {
    projectId: "similarauto",
    sheetLabel: "users",
    sheetId: "1gGcW7P2y9Ba2a_2WD03AHp6ztxfF88zA3Ed-7umRPCU",
    user: phoneWhatsApp,
    createdAt: Date.now(),
    data: JSON.stringify({ ...entiesData }),
  });

  if (createClient?.data?.newRow?.[0])
    return res.end(
      JSON.stringify({
        status: true,
        error: "success",
        message: "Cadastrado com sucesso.",
      }),
    );

  return res.end(
    JSON.stringify({
      status: false,
      error: "fail",
      message: "Cadastro não realizado",
    }),
  );
}
