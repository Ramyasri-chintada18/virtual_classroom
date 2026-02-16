import React from 'react';
import './Whiteboard.css';

const Whiteboard = () => {
    return (
        <div className="whiteboard-container">
            <div className="whiteboard-toolbar">
                <button className="tool-btn active">Pen</button>
                <button className="tool-btn">Eraser</button>
                <button className="tool-btn">Rect</button>
                <button className="tool-btn">Clear</button>
            </div>
            <canvas className="whiteboard-canvas"></canvas>
            <div className="whiteboard-empty-state">
                Canvas (Ref placeholders)
            </div>
        </div>
    );
};

export default Whiteboard;
