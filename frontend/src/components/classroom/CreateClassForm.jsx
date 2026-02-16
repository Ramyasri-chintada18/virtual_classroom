import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import './CreateClassForm.css';

const CreateClassForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        capacity: 50
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="create-class-form" onSubmit={handleSubmit}>
            <div className="form-section">
                <Input
                    label="Class Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Advanced Calculus"
                    required
                />
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        className="form-textarea"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe what will be covered..."
                        rows="3"
                    ></textarea>
                </div>
            </div>

            <div className="form-row">
                <Input
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-row">
                <Input
                    label="Student Capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    max="500"
                />
            </div>

            <div className="form-actions">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    Create Classroom
                </Button>
            </div>
        </form>
    );
};

export default CreateClassForm;
