import React, { useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MicOff, CameraOff, ShieldAlert } from 'lucide-react';
import './VideoGrid.css';

const VideoGrid = () => {
    const { localStream, user, videoEnabled, micEnabled, permissionDenied } = useOutletContext();
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && localStream && videoEnabled) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream, videoEnabled]);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="video-grid">
            <div className={`video-tile ${!videoEnabled ? 'camera-off' : ''}`}>
                {permissionDenied ? (
                    <div className="video-error-state">
                        <ShieldAlert size={48} className="text-danger" />
                        <p>Permission Denied</p>
                        <small>Click the camera icon to retry</small>
                    </div>
                ) : videoEnabled ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="local-video-feed"
                    />
                ) : (
                    <div className="avatar-fallback">
                        <div className="avatar-circle large">
                            {getInitials(user?.full_name)}
                        </div>
                    </div>
                )}

                <div className="participant-label">
                    {!micEnabled && <MicOff size={14} className="mic-status-icon" />}
                    <span>{user?.full_name || 'You'} (Instructor)</span>
                </div>

                {!videoEnabled && !permissionDenied && (
                    <div className="video-status-overlay">
                        <CameraOff size={20} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoGrid;
