// src/components/info/Info.js
import React from "react"
import { useTranslation } from "react-i18next"
import "./Info.css"

const Info = () => {
  const { t } = useTranslation() // Initialize translation hook

  return (
    <div className="info-container">
      <h1>{t("info.advanced_ai")}</h1>

      {/* Human in the Loop Section */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/humanintheloop.webp" alt="Human-in-the-Loop" />
        </div>
        <div className="info-text">
          <p>
            <b>{t("info.human_in_the_loop.title")}</b>{" "}
            {t("info.human_in_the_loop.description")}
          </p>
        </div>
      </div>

      {/* Active Learning Loop Section */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/activelearning.webp" alt="Active Learning" />
        </div>
        <div className="info-text">
          <p>
            <b>{t("info.active_learning.title")}</b>{" "}
            {t("info.active_learning.description")}
          </p>
        </div>
      </div>

      {/* Fine-tuning Section */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/fine-tuning.webp" alt="Fine-tuning" />
        </div>
        <div className="info-text">
          <p>
            <b>{t("info.fine_tuning.title")}</b>{" "}
            {t("info.fine_tuning.description")}
          </p>
        </div>
      </div>

      {/* Data Augmentation Section */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/data-augumentated.webp" alt="Data Augmentation" />
        </div>
        <div className="info-text">
          <p>
            <b>{t("info.data_augmentation.title")}</b>{" "}
            {t("info.data_augmentation.description")}
          </p>
        </div>
      </div>

      {/* Pruning Section */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/pruning.webp" alt="Pruning" />
        </div>
        <div className="info-text">
          <p>
            <b>{t("info.pruning.title")}</b> {t("info.pruning.description")}
          </p>
        </div>
      </div>

      {/* Hyperparameter Tuning Section */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/tuning.webp" alt="Hyperparameter Tuning" />
        </div>
        <div className="info-text">
          <p>
            <b>{t("info.hyperparameter_tuning.title")}</b>{" "}
            {t("info.hyperparameter_tuning.description")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Info
