import React, { useState } from "react";
import styles from "./company-widget.module.css";

const CompanyWidget = ({
  companies = [
    {
      name: "Capture",
      location: "Madrid dentro M30, Otras localizaciones",
      linkedin:
        "https://www.google.com/url?sa=D&q=https://www.linkedin.com/pub/dir/%2B/Andueza%2Bretegui&ust=1738424160000000&usg=AOvVaw1Aerjg4MArtWDIdXWKd6PF&hl=es&source=gmail",
      logo: "https://www.capture.se/Portals/0/capture_logo.png?ver=I709_EhG7WDdMhNmjSvDxg%3d%3d",
      contactName: "Andueza Retegui",
      contactEmail: "andueza@merkel.com",
    },
    {
      name: "INMOBIC OCIOPIA SL",
      location: null,
      linkedin:
        "https://es.linkedin.com/in/mariano-garc%C3%ADa-sarriguren-a7b566172",
      logo: "https://ociopia.es/wp-content/uploads/2023/10/Logo-Ociopia.webp",
      contactName: "Andueza Retegui",
      contactEmail: "andueza@merkel.com",
    },
    {
      name: "INMOBIC OCIOPIA SL",
      location: null,
      linkedin:
        "https://es.linkedin.com/in/mariano-garc%C3%ADa-sarriguren-a7b566172",
      logo: "https://ociopia.es/wp-content/uploads/2023/10/Logo-Ociopia.webp",
      contactName: "Andueza Retegui",
      contactEmail: "andueza@merkel.com",
    },
    {
      name: "INMOBIC OCIOPIA SL",
      location: null,
      linkedin:
        "https://es.linkedin.com/in/mariano-garc%C3%ADa-sarriguren-a7b566172",
      logo: "https://ociopia.es/wp-content/uploads/2023/10/Logo-Ociopia.webp",
      contactName: "Andueza Retegui",
      contactEmail: "andueza@merkel.com",
    },
    {
      name: "INMOBIC OCIOPIA SL",
      location: null,
      linkedin:
        "https://es.linkedin.com/in/mariano-garc%C3%ADa-sarriguren-a7b566172",
      logo: "https://ociopia.es/wp-content/uploads/2023/10/Logo-Ociopia.webp",
      contactName: "Andueza Retegui",
      contactEmail: "andueza@merkel.com",
    },
  ],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewJson, setViewJson] = useState(false);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadCSV = () => {
    const csvContent = [
      ["Name", "Logo", "LinkedIn", "Location", "Contact Name", "Contact Email"],
      ...companies.map((company) => [
        company.name,
        company.logo,
        company.linkedin,
        company.location,
        company.contactName,
        company.contactEmail,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "companies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.companyWidget}>
      <div className={`${styles.inputForm} ${styles.clearfix}`}>
        <input
          type="text"
          className={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name"
        />
        <div className={styles.chatControls}>
          <button
            type="button"
            className={styles.button}
            onClick={() => setViewJson(!viewJson)}
          >
            {viewJson ? "View Cards" : "View JSON"}
          </button>
          <button type="button" className={styles.button} onClick={downloadCSV}>
            Download CSV
          </button>
        </div>
      </div>

      {viewJson ? (
        <pre className={styles.jsonView}>
          {JSON.stringify(filteredCompanies, null, 2)}
        </pre>
      ) : (
        <div className={styles.companyDetails}>
          {filteredCompanies.map((company, index) => (
            <div key={index} className={styles.companyCard}>
              <div className={styles.companyCardHeader}>
                <img
                  src={company.logo || "placeholder.png"}
                  alt={company.name || "No Logo"}
                  className={styles.companyLogo}
                />
                <h2>{company.name || "No Company Selected"}</h2>
              </div>
              <p className={styles.attribute}>
                <img className={styles.icon} src="/location.svg" />{" "}
                {company.location || "N/A"}
              </p>
              <p className={styles.attribute}>
                <img className={styles.icon} src="/contact.svg" />{" "}
                {company.contactName || "N/A"}
              </p>
              <p className={styles.attribute}>
                <img className={styles.icon} src="/email.svg" />{" "}
                {company.contactEmail || "N/A"}
              </p>
              <a
                href={company.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyWidget;
