import React, { useRef, useEffect, useState } from 'react';
import './Whiteboard.css';
import { Eraser, Trash2, Edit2 } from 'lucide-react';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#7c3aed');
    const [width, setWidth] = useState(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth * 2;
        canvas.height = parent.offsetHeight * 2;
        canvas.style.width = `${parent.offsetWidth}px`;
        canvas.style.height = `${parent.offsetHeight}px`;

        const context = canvas.getContext('2d');
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = width;
        contextRef.current = context;

        // Resize handler
        const handleResize = () => {
            const tempImageData = context.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = parent.offsetWidth * 2;
            canvas.height = parent.offsetHeight * 2;
            canvas.style.width = `${parent.offsetWidth}px`;
            canvas.style.height = `${parent.offsetHeight}px`;
            context.scale(2, 2);
            context.lineCap = 'round';
            context.putImageData(tempImageData, 0, 0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = width;
        }
    }, [color, width]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="whiteboard-container">
            <div className="whiteboard-toolbar">
                <div className="tool-group colors">
                    {[
                        { color: '#7c3aed', label: 'Purple' },
                        { color: '#ef4444', label: 'Red' },
                        { color: '#10b981', label: 'Green' },
                        { color: '#111827', label: 'Black' }
                    ].map(item => (
                        <button
                            key={item.color}
                            className={`tool-btn color-btn ${color === item.color ? 'active' : ''}`}
                            style={{ backgroundColor: item.color }}
                            onClick={() => setColor(item.color)}
                            title={item.label}
                        />
                    ))}
                </div>

                <div className="divider" />

                <div className="tool-group brush-settings">
                    <Edit2 size={16} className="tool-icon" />
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="width-slider"
                        title="Brush Size"
                    />
                    <span className="width-value">{width}px</span>
                </div>

                <div className="divider" />

                <div className="tool-group actions">
                    <button className="tool-btn action-btn danger" onClick={clearCanvas} title="Clear Board">
                        <Trash2 size={18} />
                    </button>
                    <button
                        className={`tool-btn action-btn ${color === '#ffffff' ? 'active' : ''}`}
                        onClick={() => setColor('#ffffff')}
                        title="Eraser"
                    >
                        <Eraser size={18} />
                    </button>
                </div>
            </div>
            <canvas
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
                className="whiteboard-canvas"
            />
        </div>
    );
};

export default Whiteboard;
