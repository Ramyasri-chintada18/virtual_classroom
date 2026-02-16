import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRooms, createRoom, joinRoom } from '../api/classroom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (error) {
            console.error('Failed to fetch rooms', error);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!newRoomName) return;
        try {
            await createRoom({ name: newRoomName });
            setNewRoomName('');
            fetchRooms();
        } catch (error) {
            console.error('Failed to create room', error);
        }
    };

    const handleJoin = async (roomId) => {
        try {
            // ideally we might want to call the join API, but for now we just navigate
            // await joinRoom(roomId); 
            navigate(`/classroom/${roomId}`);
        } catch (error) {
            console.error("Failed to join room", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Virtual Classroom</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {user?.username}</span>
                    <Button onClick={logout} className="bg-red-500 hover:bg-red-600">Logout</Button>
                </div>
            </nav>

            <main className="p-8 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">Create a New Room</h2>
                    <form onSubmit={handleCreateRoom} className="flex gap-4">
                        <Input
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            placeholder="Room Name"
                            required
                        />
                        <Button type="submit">Create</Button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">Available Rooms</h2>
                    {rooms.length === 0 ? (
                        <p className="text-gray-500">No rooms available. Create one to get started.</p>
                    ) : (
                        <ul className="space-y-4">
                            {rooms.map(room => (
                                <li key={room.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <div>
                                        <span className="font-medium">{room.name}</span>
                                        <span className="text-sm text-gray-500 ml-2">(ID: {room.id})</span>
                                    </div>
                                    <Button onClick={() => handleJoin(room.id)}>Join</Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
