import React from "react"
import Faq from "react-faq-component"
import { useTranslation } from "react-i18next"
import "./HowWorks.css"

const Howworks = () => {
  const { t } = useTranslation() // Initialize translation hook

  // Construct data dynamically from translations
  const data = {
    title: t("faq.title"),
    rows: t("faq.questions", { returnObjects: true }),
  }

  const styles = {
    titleTextColor: "black",
    rowTitleColor: "#333",
    rowTitleTextSize: "22px",
    rowContentTextAlign: "left",
    rowContentColor: "#666",
    rowContentTextSize: "18px",
  }

  const config = {
    animate: true,
    tabFocus: true,
    expandAll: true,
  }

  return (
    <div className="faq-wrapper">
      <div className="faq-container">
        <Faq data={data} styles={styles} config={config} />
      </div>
    </div>
  )
}

export default Howworks
