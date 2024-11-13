import React, { useEffect, useState } from 'react';
import { getUsers } from '../api'; 
import './wings.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            console.log('Fetching users...');
            try {
                const data = await getUsers();
                console.log(data);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editUser) {
                const response = await fetch(`http://localhost:5000/api/users/${editUser.username}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...newUser }), 
                });

                if (!response.ok) {
                    throw new Error('Failed to update user: ' + response.statusText);
                }

                const updatedUser = await response.json(); 
                setUsers(users.map(user => (user.username === updatedUser.username ? updatedUser : user)));
                setEditUser(null); 
            } else {
                const response = await fetch('http://localhost:5000/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });

                if (!response.ok) {
                    throw new Error('Failed to add user: ' + response.statusText);
                }

                const createdUser = await response.json();
                setUsers([...users, createdUser]);
            }
        } catch (error) {
            console.error('Error during submit:', error);
            alert('An error occurred: ' + error.message);
        }
        setNewUser({ username: '', password: '' }); 
    };

    const handleDelete = async (username) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${username}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete user: ${response.statusText}`);
            }
            setUsers(users.filter(user => user.username !== username));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user: ' + error.message);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setNewUser({ username: user.username, password: user.password }); 
    };

    return (
        <div>
            <h1>User Management</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    required
                />
                <button type="submit">{editUser ? 'Update User' : 'Add User'}</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.username)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default UserManagement;