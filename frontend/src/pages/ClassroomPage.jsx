import React from 'react';
import { useOutletContext } from 'react-router-dom';
import VideoGrid from '../components/classroom/VideoGrid';
import Whiteboard from '../components/classroom/Whiteboard';
import ChatPanel from '../components/classroom/ChatPanel';
import './ClassroomPage.css';

const ClassroomPage = () => {
    const { viewMode, isSharing } = useOutletContext();

    return (
        <div className="classroom-page-content">
            {isSharing && (
                <div className="screen-share-overlay">
                    <div className="share-indicator">You are sharing your screen</div>
                    {/* In a real app, this would be the shared stream */}
                    <div className="share-placeholder">
                        <div className="share-content">
                            <h3>Screen Capture Stream</h3>
                            <p>Simulation of shared content active...</p>
                        </div>
                    </div>
                </div>
            )}

            {!isSharing && (
                <>
                    {viewMode === 'video' ? <VideoGrid /> : <Whiteboard />}
                </>
            )}

            {/* The ChatPanel visibility is handled by the layout sidebar */}
        </div>
    );
};

export default ClassroomPage;
