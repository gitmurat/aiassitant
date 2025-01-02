"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "./components/chat";
// import WeatherWidget from "./components/weather-widget";
import { getWeather } from "./utils/weather";
import SharepointFileViewer from "./components/sharepoint-file-viewer";
import FileViewer from "./components/file-viewer";
const FunctionCalling = () => {
	const [weatherData, setWeatherData] = useState({});

	const functionCallHandler = async (call) => {
		if (call?.function?.name !== "get_weather") return;
		const args = JSON.parse(call.function.arguments);
		const data = getWeather(args.location);
		setWeatherData(data);
		return JSON.stringify(data);
	};


	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<div className={styles.column}>
					{/* <WeatherWidget {...weatherData} /> */}
					<SharepointFileViewer />
					<FileViewer />
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
