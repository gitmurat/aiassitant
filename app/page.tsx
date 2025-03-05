"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "./components/chat";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import jsPDF from "jspdf";

interface SuspectDetails {
  gender?: string;
  age?: string;
  hair?: string;
  clothing?: string;
  features?: string;
}

interface CrimeReportData {
  crime_type?: string;
  datetime?: string;
  location?: string;
  suspect?: SuspectDetails;
  vehicle?: string;
  weapon?: string;
  evidence?: string;
}

const FunctionCalling = () => {
  const [crimeReport, setCrimeReport] = useState<CrimeReportData>({});

  const downloadPDFReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Detective GPT Crime Report", 105, 20, { align: "center" });

  doc.setFontSize(12);
  let yPosition = 35; // defined only once here
  const lineSpacing = 8; // defined only once here

  const addLine = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, 70, yPosition);
    yPosition += lineSpacing;
  };

  addLine("Crime Type", crimeReport.crime_type || "N/A");
  addLine("When", crimeReport.datetime || "N/A");
  addLine("Location", crimeReport.location || "N/A");
  addLine("Vehicle", crimeReport.vehicle || "N/A");

  if (crimeReport.suspect) {
    addLine("Suspect Gender", crimeReport.suspect.gender || "N/A");
    addLine("Suspect Age", crimeReport.suspect.age || "N/A");
    addLine("Hair", crimeReport.suspect.hair || "N/A");
    addLine("Clothing", crimeReport.suspect.clothing || "N/A");
    addLine("Features", crimeReport.suspect.features || "N/A");
  }

  addLine("Weapon", crimeReport.weapon || "N/A");
  addLine("Evidence", crimeReport.evidence || "N/A");

  const generatedOn = new Date().toLocaleString();
  doc.setFontSize(8);
  doc.text(`Report generated by DetectiveGPT on ${generatedOn}`, 105, 280, { align: "center" });

  doc.save("official_crime_report.pdf");
};


  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    if (!call?.function?.name) return;

    if (call.function.name === "update_crime_report") {
      const args = JSON.parse(call.function.arguments) as CrimeReportData;

      setCrimeReport((prev) => ({
        ...prev,
        ...args,
      }));

      return JSON.stringify({
        success: true,
        message: "Crime report updated",
        updatedFields: args,
      });
    }

    return;
  };

  return (
    <main className={styles.main}>
      <header className="header">
        <h1>🚔 DETECTIVE GPT READY TO ASSIST</h1>
        <p>Report crimes securely & anonymously. Your information is protected.</p>
      </header>

      <div className={styles.chatContainer}>
        <Chat functionCallHandler={functionCallHandler} />
      </div>

      <div className={styles.crimeReportContainer}>
        <h3>Crime Report Summary</h3>
        <p><strong>Type:</strong> {crimeReport.crime_type || "N/A"}</p>
        <p><strong>When:</strong> {crimeReport.datetime || "N/A"}</p>
        <p><strong>Location:</strong> {crimeReport.location || "N/A"}</p>
        <p><strong>Vehicle:</strong> {crimeReport.vehicle || "N/A"}</p>

        {crimeReport.suspect && (
          <div>
            <strong>Suspect Details:</strong>
            <p>Gender: {crimeReport.suspect.gender || "N/A"}</p>
            <p>Age: {crimeReport.suspect.age || "N/A"}</p>
            <p>Hair: {crimeReport.suspect.hair || "N/A"}</p>
            <p>Clothing: {crimeReport.suspect.clothing || "N/A"}</p>
            <p>Features: {crimeReport.suspect.features || "N/A"}</p>
          </div>
        )}

        <p><strong>Weapon:</strong> {crimeReport.weapon || "N/A"}</p>
        <p><strong>Evidence:</strong> {crimeReport.evidence || "N/A"}</p>

        <button className="downloadButton" onClick={downloadPDFReport}>
          Download PDF Report
        </button>
      </div>
    </main>
  );
};

export default FunctionCalling;
