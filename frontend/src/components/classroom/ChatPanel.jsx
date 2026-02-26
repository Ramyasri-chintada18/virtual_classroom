import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import './ChatPanel.css';
import Input from '../common/Input';
import Button from '../common/Button';

const ChatPanel = ({ messages, onSendMessage, onClose }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <h4>Class Chat</h4>
                <button className="chat-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-welcome">
                        <p>Welcome to the class chat! Messages will appear here.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender === 'You' ? 'own' : ''}`}>
                            <div className="msg-meta">
                                <span className="msg-sender">{msg.sender}</span>
                                <span className="msg-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="msg-bubble">
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="chat-input-field"
                />
                <Button size="sm" onClick={handleSend} disabled={!inputValue.trim()}>
                    <Send size={16} />
                </Button>
            </div>
        </div>
    );
};

export default ChatPanel;
