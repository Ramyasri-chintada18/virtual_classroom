import React from 'react';
import {
    Mic, MicOff, Video, VideoOff, ScreenShare,
    Layout, MessageSquare, LogOut, Disc, PenTool
} from 'lucide-react';
import Button from '../common/Button';
import './ClassroomControls.css';

const ClassroomControls = ({
    micEnabled, toggleMic,
    videoEnabled, toggleVideo,
    isSharing, toggleShare,
    isRecording, toggleRecording,
    viewMode, setViewMode,
    isChatOpen, toggleChat,
    onLeave
}) => {
    return (
        <div className="classroom-controls">
            <div className="controls-group">
                <Button
                    variant={micEnabled ? "secondary" : "danger"}
                    className="control-btn"
                    onClick={toggleMic}
                >
                    {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </Button>
                <Button
                    variant={videoEnabled ? "secondary" : "danger"}
                    className="control-btn"
                    onClick={toggleVideo}
                >
                    {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                </Button>
            </div>

            <div className="controls-group">
                <Button
                    variant={isSharing ? "primary" : "secondary"}
                    className="control-btn"
                    onClick={toggleShare}
                    title="Share Screen"
                >
                    <ScreenShare size={20} />
                </Button>
                <Button
                    variant={isRecording ? "danger" : "secondary"}
                    className="control-btn"
                    onClick={toggleRecording}
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                >
                    <Disc size={20} className={isRecording ? "animate-pulse" : ""} />
                </Button>
            </div>

            <div className="controls-group">
                <Button
                    variant={viewMode === 'video' ? "primary" : "secondary"}
                    className="control-btn"
                    onClick={() => setViewMode('video')}
                    title="Video Grid"
                >
                    <Layout size={20} />
                </Button>
                <Button
                    variant={viewMode === 'whiteboard' ? "primary" : "secondary"}
                    className="control-btn"
                    onClick={() => setViewMode('whiteboard')}
                    title="Whiteboard"
                >
                    <PenTool size={20} />
                </Button>
            </div>

            <div className="controls-group">
                <Button
                    variant={isChatOpen ? "primary" : "secondary"}
                    className="control-btn"
                    onClick={toggleChat}
                    title="Toggle Chat"
                >
                    <MessageSquare size={20} />
                </Button>
            </div>

            <Button variant="danger" className="leave-btn" onClick={onLeave}>
                <LogOut size={20} className="mr-2" /> Leave Class
            </Button>
        </div>
    );
};

export default ClassroomControls;
