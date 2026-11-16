import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "../../../styles/markdown.css";

const FrequencyAskQuestions: React.FC = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch("/faq/faq.md");
        const text = await response.text();
        setMarkdown(text);
      } catch (error) {
        console.error("Error loading FAQ markdown:", error);
      }
    };

    fetchMarkdown();
  }, []);

  return (
    <div style={{ padding: "1.5em", maxWidth: "800px", margin: "0 auto" }} className="markdown">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default FrequencyAskQuestions;
