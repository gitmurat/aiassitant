"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
import WeatherWidget from "../../components/weather-widget";
import { getWeather } from "../../utils/weather";
import { fetchOpportunities } from "../../utils/opportunities";
import FileViewer from "../../components/file-viewer";

const FunctionCalling = () => {
  const [weatherData, setWeatherData] = useState({});

  const functionCallHandler = async (call) => {
    if (!call?.function?.name)
      return JSON.stringify({ error: "No function name provided" });

    const args = JSON.parse(call.function.arguments);

    if (call.function.name === "get_weather") {
      const data = getWeather(args.location);
      setWeatherData(data);
      return JSON.stringify(data);
    }

    if (call.function.name === "search_properties") {
      try {
        const data = await fetchOpportunities({
          nombre_provincia: args.nombre_provincia,
          days_ago: args.days_ago,
          local_price_to: args.local_price_to,
          local_price_from: args.local_price_from,
          area_from: args.area_from,
          area_to: args.area_to,
          n_rooms_from: args.n_rooms_from,
          n_baths_from: args.n_baths_from,
        });

        if (!data || data.length === 0) {
          throw new Error("No se encontraron oportunidades");
        }

        return JSON.stringify(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        return JSON.stringify({
          error: "No se pudieron obtener oportunidades",
        });
      }
    }

    return JSON.stringify({ error: "Función no reconocida" });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          <WeatherWidget {...weatherData} />
          {/* <FileViewer /> */}
        </div>

        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
