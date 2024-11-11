// src/components/info/Info.js
import React from "react"
import "./Info.css"

const Info = () => {
  return (
    <div className="info-container">
      <h1>Advanced AI Optimization Approach We Use</h1>

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

      {/* Seconda riga con immagine e testo */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/activelearning.webp" alt="Active Learning" />
        </div>
        <div className="info-text">
          <p>
            <b>Active Learning Loop</b> is a technique that temporarily lowers
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

      {/* Terza riga con immagine e testo */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/fine-tuning.webp" alt="Fine-tuning" />
        </div>
        <div className="info-text">
          <p>
            <b>Fine-tuning</b> is a machine learning technique that further
            trains a pre-trained model on a smaller, specialized dataset to
            improve its performance for a specific task or domain. This process
            starts with a base model that has already been trained on a large,
            general dataset. By training it further on data specific to the
            intended application—such as medical, legal, or customer service
            fields—the model becomes more attuned to the nuances and
            requirements of that context. This targeted approach enhances the
            model's accuracy and reliability for specialized applications.
          </p>
        </div>
      </div>

      {/* Quarta riga con immagine e testo per Data Augmentation */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/data-augumentated.webp" alt="Data Augmentation" />
        </div>
        <div className="info-text">
          <p>
            <b>Data Augmentation</b> is a technique used to increase the
            diversity and quantity of data by creating modified versions of the
            original dataset. This process includes transformations such as
            rotation, flipping, and scaling. Data Augmentation helps improve the
            model's ability to generalize, especially in scenarios with limited
            data, by providing a wider range of examples during training.
          </p>
        </div>
      </div>

      {/* Quinta riga con immagine e testo per Pruning */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/pruning.webp" alt="Pruning" />
        </div>
        <div className="info-text">
          <p>
            <b>Pruning</b> is an optimization technique that removes less
            important parts of a model to make it more lightweight and efficient
            without significantly compromising accuracy. Pruning is often used
            to reduce model size, speed up inference, and deploy models in
            resource-constrained environments like mobile devices.
          </p>
        </div>
      </div>

      {/* Sesta riga con immagine e testo per Hyperparameter Tuning */}
      <div className="info-row">
        <div className="info-image">
          <img src="../images/tuning.webp" alt="Hyperparameter Tuning" />
        </div>
        <div className="info-text">
          <p>
            <b>Hyperparameter Tuning</b> involves optimizing the parameters that
            control the learning process of a model, such as learning rate and
            batch size. Techniques like grid search and random search are used
            to find the best combination of hyperparameters, improving the
            model's performance and stability in specific applications.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Info
