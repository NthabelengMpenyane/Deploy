import React, { useState } from 'react';
import './wings.css';

const Registration = ({ users, setUsers, handleLogin, view, setView }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const toggleRegisterMode = () => {
        setView(prev => (prev === 'login' ? 'register' : 'login'));
        setError('');
    };

    const handleSubmit = () => {
        if (view === 'login') {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                handleLogin(user); 
            } else {
                setError('Incorrect details. Please try again.');
            }
        } else {
            if (users.some(user => user.username === username)) {
                setError('Already used!');
                return;
            }

            setUsers([...users, { username, password }]);
            alert('You can now login!');
            toggleRegisterMode();
        }
    };

    return (
        <div id="user-register">
            <h2>{view === 'login' ? 'Login' : 'Sign Up'}</h2>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleSubmit}>{view === 'login' ? 'Login' : 'Sign Up'}</button>
            <div className="error">{error}</div>
            <p onClick={toggleRegisterMode}>{view === 'login' ? 'Do not have an account? Sign Up' : 'You have an account? Login'}</p>
        </div>
    );
};
export default Registration;