import normalize from "../helpers/normalize.js";

const FIPE_BASE = "https://parallelum.com.br/fipe/api/v1/carros";

async function getBrands() {
  const res = await fetch(`${FIPE_BASE}/marcas`);
  if (!res.ok) throw new Error("Erro ao buscar marcas");
  return res.json();
}

async function findBrandId(brandName) {
  const brands = await getBrands();

  const brand = brands.find((b) =>
    b.nome.toLowerCase().includes(brandName.toLowerCase()),
  );

  if (!brand) throw new Error("Marca não encontrada");

  return brand.codigo;
}

async function getModels(brandId) {
  const res = await fetch(`${FIPE_BASE}/marcas/${brandId}/modelos`);
  if (!res.ok) throw new Error("Erro ao buscar modelos");

  const data = await res.json();
  return data.modelos;
}

async function findModelId(brandId, modelName) {
  const models = await getModels(brandId);

  const keywords = normalize(modelName).split(/\s+/);

  let bestMatch = null;
  let bestScore = 0;

  for (const model of models) {
    const modelNameNormalized = normalize(model.nome);
    const modelWords = modelNameNormalized.split(/\s+/);

    const score = keywords.filter((k) => modelWords.includes(k)).length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = model;
    }
  }

  if (!bestMatch) throw new Error("Modelo não encontrado");

  return bestMatch.codigo;
}

async function getYears(brandId, modelId) {
  const res = await fetch(
    `${FIPE_BASE}/marcas/${brandId}/modelos/${modelId}/anos`,
  );

  if (!res.ok) throw new Error("Erro ao buscar anos");

  return res.json();
}

async function findYearId(brandId, modelId, year) {
  const years = await getYears(brandId, modelId);

  const yearObj = years.find((y) => y.nome.includes(year));

  if (!yearObj) throw new Error("Ano não encontrado");

  return yearObj.codigo;
}

async function getVehicleFipeData(brandId, modelId, yearId) {
  const res = await fetch(
    `${FIPE_BASE}/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`,
  );

  if (!res.ok) throw new Error("Erro ao buscar dados FIPE");

  const data = await res.json();

  return {
    price: data?.Valor,
    details: data?.Modelo,
    fipeCode: data?.CodigoFipe,
    monthReference: data?.MesReferencia,
  };
}

async function getVehicleFullData(data) {
  const { brand, model, yearModel, fuel } = data?.result;
  const vehicleDetails = `${brand} ${model} ${yearModel} ${fuel}`;

  const brandId = await findBrandId(brand);

  const modelId = await findModelId(brandId, vehicleDetails);

  const yearId = await findYearId(brandId, modelId, yearModel);

  const fipeData = await getVehicleFipeData(brandId, modelId, yearId);

  return {
    ...data.result,
    ...fipeData,
  };
}

export default async function GetVehicleByPlate(plate) {
  const url = `${process.env.BASEURL_NODEWORKS || "http://localhost:4133"}/v1/plates`;
  console.log("url pupper...", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plate }),
  });

  if (!res.ok) throw new Error("Erro ao buscar dados");

  const data = await res.json();
  return await getVehicleFullData(data);
}
