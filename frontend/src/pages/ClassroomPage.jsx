import React, { useState } from 'react';
import VideoGrid from '../components/classroom/VideoGrid';
import Whiteboard from '../components/classroom/Whiteboard';
import ChatPanel from '../components/classroom/ChatPanel';
import Button from '../components/common/Button';
import './ClassroomPage.css';

const ClassroomPage = () => {
    const [viewMode, setViewMode] = useState('video'); // 'video' | 'whiteboard'
    const [isChatOpen, setIsChatOpen] = useState(true);

    return (
        <div className="classroom-container">
            <div className="classroom-content">
                <div className="toolbar-floating">
                    <Button
                        variant={viewMode === 'video' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setViewMode('video')}
                    >
                        Video View
                    </Button>
                    <Button
                        variant={viewMode === 'whiteboard' ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setViewMode('whiteboard')}
                    >
                        Whiteboard
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                        {isChatOpen ? 'Hide Chat' : 'Show Chat'}
                    </Button>
                </div>

                {viewMode === 'video' ? <VideoGrid /> : <Whiteboard />}
            </div>

            {isChatOpen && (
                <div className="classroom-chat-sidebar">
                    <ChatPanel />
                </div>
            )}
        </div>
    );
};

export default ClassroomPage;
