import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "../../../styles/markdown.css";

const PrivacyPolicyMarkdown: React.FC = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch("/privacy-policy/pl.md");
        const text = await response.text();
        setMarkdown(text);
      } catch (error) {
        console.error("Error loading privacy policy markdown:", error);
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

export default PrivacyPolicyMarkdown;
