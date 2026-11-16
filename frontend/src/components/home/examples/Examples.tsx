import React, { Component } from 'react';

export default class Examples extends Component {
    render() {
        const imgStyle: React.CSSProperties = {
            maxWidth: '100%',
            border: '2px solid #800080',         // Delikatne obramowanie
            borderRadius: '0.75rem',          // Zaokrąglenie narożników
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', // Opcjonalnie: delikatny cień
        };

        return (
            <div>
                <div className="card-container center">
                    <img
                        src="/images/screenshots/screenshot_01.jpg"
                        alt="screenshot_01"
                        style={imgStyle}
                    />
                </div>
                <div className="card-container center">
                    <img
                        src="/images/screenshots/screenshot_02.jpg"
                        alt="screenshot_02"
                        style={imgStyle}
                    />
                </div>
                <div className="card-container center">
                    <img
                        src="/images/screenshots/screenshot_03.jpg"
                        alt="screenshot_03"
                        style={imgStyle}
                    />
                </div>
            </div>

        );
    }
}
