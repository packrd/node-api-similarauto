//import "./config/global.cache.js";
import Roxter from "roxterjs";

const roxter = await Roxter();
roxter.Start({
  setHeaders: [
    { name: "Access-Control-Allow-Origin", value: "*" },
    { name: "Access-Control-Allow-Methods", value: "GET, OPTIONS, POST, PUT" },
    {
      name: "Access-Control-Allow-Headers",
      value: "Content-Type, Authorization",
    },
  ],
});
