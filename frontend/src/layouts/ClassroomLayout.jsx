import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ClassroomControls from '../components/classroom/ClassroomControls';
import recordingService from '../services/recording_service';
import './ClassroomLayout.css';

import ChatPanel from '../components/classroom/ChatPanel';
import socketService from '../services/socket.service';
import { useAuth } from '../store/AuthStore';

const ClassroomLayout = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { user } = useAuth();

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('video'); // 'video' | 'whiteboard'
    const [messages, setMessages] = useState([]);

    // Media States
    const [localStream, setLocalStream] = useState(null);
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    // Socket Connection
    useEffect(() => {
        socketService.connect(roomId);
        socketService.onMessage((data) => {
            if (data.type === 'chat') {
                setMessages(prev => [...prev, data]);
            }
        });

        return () => {
            socketService.disconnect();
        };
    }, [roomId]);

    const handleSendMessage = (text) => {
        const msg = {
            type: 'chat',
            sender: user?.full_name || 'Anonymous',
            text,
            timestamp: new Date().toISOString()
        };
        socketService.sendMessage(msg);
        setMessages(prev => [...prev, msg]);
    };

    // Acquire Media Stream
    const startMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);
            setPermissionDenied(false);

            // Apply current UI states to the new stream
            stream.getAudioTracks().forEach(track => track.enabled = micEnabled);
            stream.getVideoTracks().forEach(track => track.enabled = videoEnabled);
        } catch (err) {
            console.error("Error accessing media devices:", err);
            setPermissionDenied(true);
        }
    };

    useEffect(() => {
        startMedia();

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleMic = async () => {
        if (!localStream && permissionDenied) {
            await startMedia();
            return;
        }

        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !micEnabled;
                setMicEnabled(!micEnabled);
            }
        }
    };

    const toggleVideo = async () => {
        if (!localStream && permissionDenied) {
            await startMedia();
            return;
        }

        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoEnabled;
                setVideoEnabled(!videoEnabled);
            }
        }
    };

    // Recording Logic
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm; codecs=vp9'
            });

            mediaRecorderRef.current = mediaRecorder;
            recordedChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(recordedChunksRef.current, {
                    type: 'video/webm'
                });

                try {
                    console.log('Uploading recording...');
                    await recordingService.uploadRecording(roomId, blob);
                    console.log('Recording uploaded successfully');
                    alert('Recording saved successfully!');
                } catch (error) {
                    console.error('Failed to upload recording:', error);
                    alert('Failed to save recording.');
                }

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not start recording. Please make sure you grant screen capture permissions.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleLeave = () => {
        if (window.confirm('Are you sure you want to leave the class?')) {
            if (isRecording) handleStopRecording();
            navigate('/dashboard');
        }
    };

    return (
        <div className="classroom-layout">
            <header className="layout-header">
                <div className="brand">Virtual Classroom</div>
                <div className="room-info">Room ID: {roomId}</div>
                {isRecording && (
                    <div className="recording-status">
                        <span className="dot animate-pulse"></span>
                        Recording Session
                    </div>
                )}
            </header>

            <main className="layout-stage">
                <Outlet context={{
                    viewMode, setViewMode,
                    isSharing, setIsSharing,
                    micEnabled, videoEnabled,
                    isRecording, localStream,
                    user, permissionDenied
                }} />
            </main>

            <aside className={`layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <ChatPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </aside>

            <footer className="layout-footer">
                <ClassroomControls
                    micEnabled={micEnabled}
                    toggleMic={toggleMic}
                    videoEnabled={videoEnabled}
                    toggleVideo={toggleVideo}
                    isSharing={isSharing}
                    toggleShare={() => setIsSharing(!isSharing)}
                    isRecording={isRecording}
                    toggleRecording={() => isRecording ? handleStopRecording() : handleStartRecording()}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    isChatOpen={isSidebarOpen}
                    toggleChat={() => setIsSidebarOpen(!isSidebarOpen)}
                    onLeave={handleLeave}
                />
            </footer>
        </div>
    );
};

export default ClassroomLayout;
