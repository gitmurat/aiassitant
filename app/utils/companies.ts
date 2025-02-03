import companiesData from "./preguntaTetuan.json";

const getCompanies = () => {
  console.log("getCompanies se ejecuta");

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(companiesData);
    }, 1000); // Simulación de retardo de API
  });
};

export { getCompanies };
