export async function fetchTransactions() {
  try {
    const response = await fetch("/api/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos de Tinybird para transacciones");
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error en fetchTransactions:", error);
    throw error;
  }
}
