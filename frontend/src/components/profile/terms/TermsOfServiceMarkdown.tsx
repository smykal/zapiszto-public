import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const TermsOfServiceMarkdown: React.FC = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch("/terms-of-service/pl.md"); // umieszczony w public/
        const text = await response.text();
        setMarkdown(text);
      } catch (error) {
        console.error("Error loading terms of service markdown:", error);
      }
    };

    fetchMarkdown();
  }, []);

  return (
    <div style={{ padding: "1.5em", maxWidth: "800px", margin: "0 auto", color: "white" }} className="markdown">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default TermsOfServiceMarkdown;
