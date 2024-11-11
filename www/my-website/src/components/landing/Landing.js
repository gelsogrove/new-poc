// src/components/Landing.js
import React from "react"
import Contacts from "../contacts/Contacts"

import "./Landing.css" // Importa il file CSS per lo styling

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="text-section">
        <p className="larger-text">
          Our approach is focused on creating real-world impact. We offer
          advanced artificial intelligence solutions that help businesses
          operate more efficiently and make a meaningful difference. By
          continually seeking and selecting the best AI technologies and
          products, we ensure our clients have the most up-to-date tools that
          meet their needs.
          <br />
          <br /> Our process includes:
          <br />
        </p>
        <ul className="bulleted-list">
          <li>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.77404 9.93175C4.44485 9.93175 4.11565 9.80186 3.86435 9.54044L0.376956 5.91256C-0.125652 5.38974 -0.125652 4.54277 0.376956 4.02145C0.879564 3.49863 1.69226 3.4971 2.19487 4.01994L4.77404 6.70297L10.8406 0.392129C11.3432 -0.13071 12.1559 -0.13071 12.6586 0.392129C13.1611 0.914977 13.1611 1.76193 12.6586 2.28477L5.68371 9.54044C5.43243 9.80186 5.10323 9.93175 4.77404 9.93175Z"
                fill="currentColor"
              ></path>
            </svg>
            Identifying areas for AI integration
          </li>
          <li>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.77404 9.93175C4.44485 9.93175 4.11565 9.80186 3.86435 9.54044L0.376956 5.91256C-0.125652 5.38974 -0.125652 4.54277 0.376956 4.02145C0.879564 3.49863 1.69226 3.4971 2.19487 4.01994L4.77404 6.70297L10.8406 0.392129C11.3432 -0.13071 12.1559 -0.13071 12.6586 0.392129C13.1611 0.914977 13.1611 1.76193 12.6586 2.28477L5.68371 9.54044C5.43243 9.80186 5.10323 9.93175 4.77404 9.93175Z"
                fill="currentColor"
              ></path>
            </svg>
            Researching the latest trends
          </li>
          <li>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.77404 9.93175C4.44485 9.93175 4.11565 9.80186 3.86435 9.54044L0.376956 5.91256C-0.125652 5.38974 -0.125652 4.54277 0.376956 4.02145C0.879564 3.49863 1.69226 3.4971 2.19487 4.01994L4.77404 6.70297L10.8406 0.392129C11.3432 -0.13071 12.1559 -0.13071 12.6586 0.392129C13.1611 0.914977 13.1611 1.76193 12.6586 2.28477L5.68371 9.54044C5.43243 9.80186 5.10323 9.93175 4.77404 9.93175Z"
                fill="currentColor"
              ></path>
            </svg>
            Collect data
          </li>
          <li>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.77404 9.93175C4.44485 9.93175 4.11565 9.80186 3.86435 9.54044L0.376956 5.91256C-0.125652 5.38974 -0.125652 4.54277 0.376956 4.02145C0.879564 3.49863 1.69226 3.4971 2.19487 4.01994L4.77404 6.70297L10.8406 0.392129C11.3432 -0.13071 12.1559 -0.13071 12.6586 0.392129C13.1611 0.914977 13.1611 1.76193 12.6586 2.28477L5.68371 9.54044C5.43243 9.80186 5.10323 9.93175 4.77404 9.93175Z"
                fill="currentColor"
              ></path>
            </svg>
            Training models
          </li>

          <li>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.77404 9.93175C4.44485 9.93175 4.11565 9.80186 3.86435 9.54044L0.376956 5.91256C-0.125652 5.38974 -0.125652 4.54277 0.376956 4.02145C0.879564 3.49863 1.69226 3.4971 2.19487 4.01994L4.77404 6.70297L10.8406 0.392129C11.3432 -0.13071 12.1559 -0.13071 12.6586 0.392129C13.1611 0.914977 13.1611 1.76193 12.6586 2.28477L5.68371 9.54044C5.43243 9.80186 5.10323 9.93175 4.77404 9.93175Z"
                fill="currentColor"
              ></path>
            </svg>
            Continuous improvement
          </li>

          <li>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.77404 9.93175C4.44485 9.93175 4.11565 9.80186 3.86435 9.54044L0.376956 5.91256C-0.125652 5.38974 -0.125652 4.54277 0.376956 4.02145C0.879564 3.49863 1.69226 3.4971 2.19487 4.01994L4.77404 6.70297L10.8406 0.392129C11.3432 -0.13071 12.1559 -0.13071 12.6586 0.392129C13.1611 0.914977 13.1611 1.76193 12.6586 2.28477L5.68371 9.54044C5.43243 9.80186 5.10323 9.93175 4.77404 9.93175Z"
                fill="currentColor"
              ></path>
            </svg>
            Monitoring
          </li>
        </ul>
      </div>
      <Contacts />
    </div>
  )
}

export default Landing
