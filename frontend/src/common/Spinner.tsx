import React from "react";

const Spinner: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <span className="loader" />
    </div>
  );
};

export default Spinner;
