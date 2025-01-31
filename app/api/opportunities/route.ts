import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

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

export async function POST(req) {
  try {
    const params: OpportunityRequest = await req.json();

    const response = await fetch(
      "https://api.cassandra-ai.com/api/opportunities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CASSANDRA_API_KEY as string, // Usa variable de entorno
        },
        body: JSON.stringify(params),
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      return NextResponse.json(data, { status: response.status });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        "No se encontraron oportunidades para los filtros seleccionados",
        { status: 200 }
      );
    } else {
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    console.error("Error en la API de oportunidades:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
