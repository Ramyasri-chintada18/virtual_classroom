import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ClassroomControls from '../components/classroom/ClassroomControls';
import recordingService from '../services/recording_service';
import './ClassroomLayout.css';

import ChatPanel from '../components/classroom/ChatPanel';
import socketService from '../services/socket.service';
import { useAuth } from '../store/AuthStore';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { Video, Mic, MicOff, VideoOff, Settings } from 'lucide-react';

const ClassroomLayout = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { user } = useAuth();

    // UI States
    const [joined, setJoined] = useState(false); // NEW: Pre-Join state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('video'); // 'video' | 'whiteboard'
    const [messages, setMessages] = useState([]);

    // Media States
    const [localStream, setLocalStream] = useState(null);
    const [micEnabled, setMicEnabled] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [screenStream, setScreenStream] = useState(null);
    const [pendingRecordStream, setPendingRecordStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    // Socket Connection
    useEffect(() => {
        if (joined) {
            socketService.connect(roomId);
            socketService.onMessage((data) => {
                if (data.type === 'chat') {
                    setMessages(prev => [...prev, data]);
                }
            });

            return () => {
                socketService.disconnect();
            };
        }
    }, [roomId, joined]);

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

    useEffect(() => {
        // Explicitly clear any media holding when component unmounts
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    track.stop();
                    localStream.removeTrack(track);
                });
            }
        };
    }, [localStream]);

    // HARDWARE TOGGLES: Actually stop the track so the camera light turns off
    const toggleMic = async () => {
        if (micEnabled) {
            // Stop mic completely
            if (localStream) {
                const audioTracks = localStream.getAudioTracks();
                audioTracks.forEach(track => {
                    track.stop();
                    localStream.removeTrack(track);
                });
                // If video is also off (or no tracks left), kill the whole stream object
                if (localStream.getTracks().length === 0 || !videoEnabled) {
                    setLocalStream(null);
                }
            }
            setMicEnabled(false);
        } else {
            // Re-acquire mic
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const track = stream.getAudioTracks()[0];

                if (localStream) {
                    localStream.addTrack(track);
                    setLocalStream(new MediaStream(localStream.getTracks()));
                } else {
                    // Create new stream if none exists
                    setLocalStream(new MediaStream([track]));
                }

                setMicEnabled(true);
                setPermissionDenied(false);
            } catch (err) {
                console.error("Could not access microphone", err);
                alert("Microphone permission denied or device not found.");
            }
        }
    };

    const toggleVideo = async () => {
        if (videoEnabled) {
            // Stop camera completely
            if (localStream) {
                const videoTracks = localStream.getVideoTracks();
                videoTracks.forEach(track => {
                    track.stop();
                    localStream.removeTrack(track);
                });
                // If mic is also off (or no tracks left), kill the whole stream object
                if (localStream.getTracks().length === 0 || !micEnabled) {
                    setLocalStream(null);
                }
            }
            setVideoEnabled(false);
        } else {
            // Re-acquire camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const track = stream.getVideoTracks()[0];

                if (localStream) {
                    localStream.addTrack(track);
                    setLocalStream(new MediaStream(localStream.getTracks()));
                } else {
                    // Create new stream if none exists
                    setLocalStream(new MediaStream([track]));
                }

                setVideoEnabled(true);
                setPermissionDenied(false);
            } catch (err) {
                console.error("Could not access camera", err);
                alert("Camera permission denied or device not found.");
            }
        }
    };

    const handleToggleShare = async () => {
        if (isSharing) {
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
            }
            setScreenStream(null);
            setIsSharing(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });

                // Handle user clicking "Stop Sharing" in browser bar
                stream.getVideoTracks()[0].onended = () => {
                    setScreenStream(null);
                    setIsSharing(false);
                };

                setScreenStream(stream);
                setIsSharing(true);
            } catch (err) {
                console.error("Error starting screen share:", err);
            }
        }
    };

    // Recording Logic
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const handleStartRecording = async () => {
        setShowRecordModal(false);
        const stream = pendingRecordStream;
        if (!stream) return;

        try {
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
                    setShowSuccessModal(true);
                } catch (error) {
                    console.error('Failed to upload recording:', error);
                    alert('Failed to save recording.');
                }

                // Only stop the stream if it's NOT the active screen share stream
                if (stream !== screenStream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                setPendingRecordStream(null);
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

    const handleRecordPrompt = async () => {
        if (isSharing && screenStream) {
            setPendingRecordStream(screenStream);
            setShowRecordModal(true);
        } else {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });
                setPendingRecordStream(stream);
                setShowRecordModal(true);
            } catch (err) {
                console.error("Error acquiring recording stream:", err);
            }
        }
    };

    const handleCloseRecordModal = () => {
        if (pendingRecordStream && pendingRecordStream !== screenStream) {
            pendingRecordStream.getTracks().forEach(track => track.stop());
        }
        setPendingRecordStream(null);
        setShowRecordModal(false);
    };

    const handleLeave = () => {
        if (window.confirm('Are you sure you want to leave the class?')) {
            if (isRecording) handleStopRecording();
            navigate('/dashboard');
        }
    };

    // Helper for Pre-Join Video Preview
    const previewVideoRef = useRef(null);
    useEffect(() => {
        if (!joined && previewVideoRef.current && localStream) {
            previewVideoRef.current.srcObject = localStream;
        }
    }, [localStream, joined]);

    if (!joined) {
        return (
            <div className="pre-join-container">
                <div className="pre-join-card">
                    <h2 className="pre-join-title">Ready to join?</h2>

                    <div className="pre-join-preview">
                        {videoEnabled ? (
                            <video
                                ref={previewVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="preview-video"
                            />
                        ) : (
                            <div className="preview-placeholder">
                                <div className="avatar-circle">
                                    {user?.full_name?.charAt(0) || 'U'}
                                </div>
                                <p>Camera is off</p>
                            </div>
                        )}

                        {/* Audio Indicator overlay could go here */}
                    </div>

                    <div className="pre-join-controls">
                        <Button
                            variant={micEnabled ? "secondary" : "danger"}
                            className="pre-join-btn circle-btn"
                            onClick={toggleMic}
                        >
                            {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                        </Button>
                        <Button
                            variant={videoEnabled ? "secondary" : "danger"}
                            className="pre-join-btn circle-btn"
                            onClick={toggleVideo}
                        >
                            {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                        </Button>
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        className="join-big-btn"
                        onClick={() => setJoined(true)}
                    >
                        Join Class
                    </Button>
                </div>
            </div>
        );
    }

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
                    screenStream,
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
                    toggleShare={handleToggleShare}
                    isRecording={isRecording}
                    toggleRecording={() => isRecording ? handleStopRecording() : handleRecordPrompt()}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    isChatOpen={isSidebarOpen}
                    toggleChat={() => setIsSidebarOpen(!isSidebarOpen)}
                    onLeave={handleLeave}
                />
            </footer>

            <Modal
                isOpen={showRecordModal}
                onClose={handleCloseRecordModal}
                title="Start Recording"
            >
                <div className="recording-setup-modal">
                    <div className="modal-description">
                        <p>Your selected window is ready to be recorded. This will capture:</p>
                        <ul className="record-feature-list">
                            <li>Visuals (Selected Window/Tab)</li>
                            <li>Audio (Microphone and System Sound)</li>
                        </ul>
                    </div>
                    <div className="modal-actions">
                        <Button variant="secondary" onClick={handleCloseRecordModal}>Cancel</Button>
                        <Button variant="primary" onClick={handleStartRecording}>Start Recording</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Recording Saved!"
            >
                <div className="recording-success-modal">
                    <div className="success-icon-container">
                        <Video size={48} className="success-icon" />
                    </div>
                    <div className="modal-description">
                        <p>Your class recording has been successfully saved and is now available in your personal recordings library.</p>
                    </div>
                    <div className="modal-actions">
                        <Button variant="ghost" onClick={() => setShowSuccessModal(false)}>Stay in Class</Button>
                        <Button variant="primary" onClick={() => navigate('/recordings')}>View Recordings</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ClassroomLayout;
