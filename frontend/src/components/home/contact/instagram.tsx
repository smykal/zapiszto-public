import React from "react";

type InstagramProps = {
    username: string;
};

const Instagram: React.FC<InstagramProps> = ({ username }) => {
    username = username.startsWith('@') ? username.slice(1) : username;
    const url = `https://www.instagram.com/${username}`;

    return (
        <div>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", verticalAlign: "middle", marginRight: "8px" }}
            >
                <img src="/images/Instagram_logo_2016.svg.png" alt="Instagram" style={{ width: "3rem", height: "3rem" }} />
            </a>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    color: "white",
                    borderRadius: "1rem",
                    textDecoration: "none",
                    fontWeight: "bold",
                    transition: "background-color 0.3s ease",
                }}
                className="button"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#C13584")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
                @{username}
            </a>
        </div>
    );
};

export default Instagram;
