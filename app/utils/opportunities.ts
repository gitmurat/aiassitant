interface OpportunityRequest {
  nombre_provincia: string;
  days_ago?: number;
  local_price_to?: number;
  local_price_from?: number;
  area_from?: number;
  area_to?: number;
  n_rooms_from?: number;
  n_baths_from?: number;
}

export async function fetchOpportunities(params: OpportunityRequest) {
  try {
    const response = await fetch("/api/opportunities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Error al obtener oportunidades");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en fetchOpportunities:", error);
    throw error;
  }
}
