// src/components/info/Info.js
import React from "react"
import "./Info.css"

const Info = () => {
  return (
    <div className="info-container">
      {/* Prima riga con immagine e testo */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/humanintheloop.webp" alt="Human-in-the-Loop" />
        </div>
        <div className="info-text">
          <p>
            <b>Human in the Loop (HITL) </b> is an approach in artificial
            intelligence that integrates human intervention in the stages of
            training, fine-tuning, labelling, and data collection, ensuring
            optimal model accuracy. Beyond enhancing precision, HITL enables the
            handling of complex situations that are difficult to automate. It is
            essential that operators receive adequate training to effectively
            contribute to this continuous improvement process, providing the
            system with the flexibility needed to adapt quickly to unexpected
            changes or requirements.
          </p>
        </div>
      </div>
      <hr />

      {/* Seconda riga con immagine e testo */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/activelearning.webp" alt="Human-in-the-Loop" />
        </div>
        <div className="info-text">
          <p>
            <b>Active Learning loop </b> is a technique that temporarily lowers
            the model's accuracy to find new datasets where it is unsure and
            needs human help to label data correctly. The model picks out these
            difficult datasets and sends them to human experts for re-labeling.
            This process improves the quality of the labeled data and helps the
            model learn from challenging cases, increasing its overall accuracy
            over time. By focusing on the hardest cases, the Active Learning
            loop helps the model handle complex situations that are difficult to
            automate.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Info
