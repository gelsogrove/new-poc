import React from "react"
import Faq from "react-faq-component"
import "./HowWorks.css"

const data = {
  title: "Frequently Asked Questions (FAQ)",
  rows: [
    {
      title: "What are the benefits of using AI in my business?",
      content:
        "Using artificial intelligence in your business can lead to significant improvements in efficiency, accuracy, and productivity. AI can automate repetitive tasks, allowing employees to focus on higher-level, strategic activities. It can analyze large datasets quickly and provide insights that inform decision-making, helping you to spot trends, optimize operations, and understand customer behavior better. Implementing AI-driven solutions often results in cost savings, better customer satisfaction, and a competitive edge in the market as you streamline workflows and innovate continuously.",
    },
    {
      title: "What advantages can a Custom Chatbot bring to my business?",
      content:
        "A custom chatbot offers many benefits, including enhanced customer support and improved operational efficiency. By automating responses to frequently asked questions and providing 24/7 assistance, a chatbot can help customers resolve issues quickly and conveniently. This automation can also reduce the load on customer support teams, allowing them to focus on complex cases that require human intervention. Furthermore, a well-designed chatbot can drive engagement, guide customers through the purchasing process, and collect valuable data on customer preferences and behaviors, which can inform your business strategies.",
    },
    {
      title: "What benefits can Custom Vision bring to my business?",
      content:
        "Custom Vision technology can transform quality control processes, particularly in industries with complex production lines. By using AI to visually monitor products, Custom Vision can automatically detect defects, anomalies, or inconsistencies that may be difficult for human inspectors to spot. This technology ensures that only high-quality products reach customers, reducing returns and enhancing brand reputation. Furthermore, Custom Vision can track patterns and alert teams to recurring issues, providing valuable data to refine production methods and improve product quality over time. For businesses aiming to maintain high standards and reduce operational costs, Custom Vision offers a powerful, scalable solution.",
    },
    {
      title: "Is there a data security issue?",
      content:
        "Data security is paramount in all AI applications, and we take extensive measures to safeguard it. Our team adheres to best practices for data protection, including encryption protocols, regular security audits, and restricted access to sensitive data. We comply with all relevant data protection laws and regulations to ensure privacy and security compliance. Additionally, we provide transparency about data handling processes and conduct regular risk assessments to identify and address any vulnerabilities, giving our clients confidence that their data is in safe hands.",
    },
    {
      title: "How do you ensure the quality of the AI models?",
      content:
        "Ensuring the quality of AI models involves a multi-step process that includes rigorous validation, testing, and continuous optimization. Initially, we use large, diverse datasets to train the models, which helps to establish a broad knowledge base. Once a model is trained, it undergoes extensive testing on real-world scenarios to ensure its accuracy and reliability in practical applications. We employ techniques such as Human-in-the-Loop (HITL) and Active Learning, where human experts provide feedback on uncertain or misclassified data points, allowing the model to learn and improve iteratively. Furthermore, we continuously monitor models post-deployment, refining them based on new data and feedback to maintain high performance and adapt to evolving business needs. This commitment to quality helps us deliver robust, adaptable AI models that are effective and precise in meeting our clients’ objectives.",
    },

    {
      title: "What technologies do we use?",
      content:
        "We leverage a variety of cutting-edge AI technologies, including machine learning, deep learning, computer vision, and natural language processing (NLP). Our projects often involve custom models tailored to specific client needs, ensuring high relevance and effectiveness. We also use advanced techniques like Human-in-the-Loop (HITL) to improve model quality and Active Learning to keep models up-to-date and responsive to new data. These technologies allow us to create adaptable, high-performance solutions that meet modern business demands.",
    },
  ],
}

const styles = {
  titleTextColor: "black",
  rowTitleColor: "#333",
  rowTitleTextSize: "22px",
  rowContentTextAlign: "left",
  rowContentColor: "#666",
  rowContentTextSize: "18px", // Set font size here
}

const config = {
  animate: true,
  tabFocus: true,
  expandAll: true,
}

export const Howworks = () => {
  return (
    <div className="faq-wrapper">
      <div className="faq-container">
        <Faq data={data} styles={styles} config={config} />
      </div>
    </div>
  )
}
