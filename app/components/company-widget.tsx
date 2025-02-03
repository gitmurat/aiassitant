import React, { useState, useEffect } from "react";
import styles from "./company-widget.module.css";

const CompanyWidget = ({ companies = [] }) => {
  // const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewJson, setViewJson] = useState(false);
  const show = companies.length > 0;

  // useEffect(() => {
  //   console.log("companies", companies);

  //   if (companies.length > 0) {
  //     setShow(true);
  //   } else {
  //     setTimeout(() => setShow(false), 300);
  //   }
  // }, [companies]);

  const filteredCompanies = companies.filter((company) =>
    company.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadCSV = () => {
    const csvContent = [
      ["Name", "Logo", "LinkedIn", "Location", "Contact Name", "Contact Email"],
      ...companies.map((company) => [
        company.nombre,
        company.logo,
        company.linkedin,
        company.direccion,
        company.contact_name,
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
    <div
      className={`${styles.companyWidget} ${
        show ? styles.fadeIn : styles.fadeOut
      }`}
    >
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
                  src={company.logo || "/placeholder.jpg"}
                  alt={company.nombre || "No Logo"}
                  className={styles.companyLogo}
                />
                <h2>{company.nombre || "No Company Selected"}</h2>
              </div>
              <p className={styles.attribute}>
                <img className={styles.icon} src="/location.svg" />{" "}
                {company.direccion || "N/A"}
              </p>
              <p className={styles.attribute}>
                <img className={styles.icon} src="/contact.svg" />{" "}
                {company.contact_name || "N/A"}
              </p>
              <p className={styles.attribute}>
                <img className={styles.icon} src="/email.svg" />{" "}
                {company.email || "N/A"}
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
