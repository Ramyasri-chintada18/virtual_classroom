import React from 'react';
import './ChatPanel.css';
import Input from '../common/Input';
import Button from '../common/Button';

const ChatPanel = () => {
    return (
        <div className="chat-panel">
            <div className="chat-header">
                <h4>Class Chat</h4>
            </div>
            <div className="chat-messages">
                <div className="message">
                    <span className="msg-user">Teacher:</span>
                    <p className="msg-text">Welcome class!</p>
                </div>
                <div className="message mine">
                    <span className="msg-user">Me:</span>
                    <p className="msg-text">Hello sir!</p>
                </div>
            </div>
            <div className="chat-input-area">
                <Input placeholder="Type a message..." className="chat-input-wrapper" />
                <Button size="sm">Send</Button>
            </div>
        </div>
    );
};

export default ChatPanel;
