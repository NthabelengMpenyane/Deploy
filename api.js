import axios from 'axios';

export const getUsers = async () => {
    const response = await axios.get(`http://localhost:5000/api/users?username=${username}`);
    return response.data;
};

export const addUser = async (user) => {
    const response = await axios.post(`http://localhost:5000/api/users/${username}`, user);
    return response.data;
};

export const updateUser = async (username, user) => {
    const response = await axios.put(`http://localhost:5000/api/users/${username}`, user);
    return response.data;
};

export const deleteUser = async (username) => {
    const response = await axios.delete(`http://localhost:5000/api/users/${username}`);
    return response.data;
};

export const getProducts = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/products/${products}`); 
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; 
    }
};

export const addProduct = async (product) => {
    const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
};

export const updateProduct = async (id, product) => {
    const response = await axios.put(`http://localhost:5000/api/products/${product}`, product); 
    return response.data;
};

export const deleteProduct = async (id) => {
    return await axios.delete(`http://localhost:5000/api/products/${id}`);
};