import React from 'react';
import './VideoGrid.css';

const VideoGrid = () => {
    return (
        <div className="video-grid">
            {/* Simulation of 4 users */}
            {[1, 2, 3, 4].map((id) => (
                <div key={id} className="video-tile">
                    <div className="video-placeholder">
                        <span className="avatar-circle">{id}</span>
                    </div>
                    <div className="video-name">Student {id}</div>
                </div>
            ))}
        </div>
    );
};

export default VideoGrid;
