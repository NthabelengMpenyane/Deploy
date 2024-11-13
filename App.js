import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Registration from './my-components/Registration';
import Dashboard from './my-components/Dashboard';
import WelcomePage from './my-components/WelcomePage';
import UserManagement from './my-components/UserManagement';
import ProductManagement from './my-components/ProductManagement';

const App = () => {
    const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || []);
    const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [soldProducts, setSoldProducts] = useState([]);
    const [view, setView] = useState('login');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('soldProducts', JSON.stringify(soldProducts));
    }, [products, users, soldProducts]);

    const handleLogin = (user) => {
        setLoggedInUser(user);
        navigate('/dashboard');
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        navigate('/welcome');
    };

    const handleNewSale = (productId, quantity, product) => {
        setSoldProducts(prev => [...prev, { name: product.name, quantity, time: new Date().toLocaleString() }]);
        setProducts(prevProducts => 
            prevProducts.map(p => p.id === productId ? { ...p, quantity: p.quantity - quantity } : p)
        );
    };

    return (
        <div className="app">
            {location.pathname !== '/welcome' && location.pathname !== '/registration' && (
                <nav className="text-navigation">
                    <input 
                        type="button" 
                        value="Welcome" 
                        onClick={() => navigate('/welcome')} 
                    />
                    <input 
                        type="button" 
                        value="Dashboard" 
                        onClick={() => navigate('/dashboard')} 
                    />
                    <input 
                        type="button" 
                        value="User Management" 
                        onClick={() => navigate('/userManagement')} 
                    />
                    <input 
                        type="button" 
                        value="Product Management" 
                        onClick={() => navigate('/productManagement')} 
                    />
                    {loggedInUser && (
                        <input 
                            type="button" 
                            value="Logout" 
                            onClick={handleLogout} 
                        />
                    )}
                </nav>
            )}

            <Routes>
                <Route path="/welcome" element={<WelcomePage />} />
                <Route 
                    path="/registration" 
                    element={<Registration users={users} setUsers={setUsers} handleLogin={handleLogin} view={view} setView={setView} />} 
                />
                <Route 
                    path="/dashboard" 
                    element={<Dashboard products={products} soldProducts={soldProducts} />} 
                />
                <Route path="/userManagement" element={<UserManagement users={users} setUsers={setUsers} />} />
                <Route 
                    path="/productManagement" 
                    element={<ProductManagement products={products} setProducts={setProducts} handleNewSale={handleNewSale} />} 
                />
                <Route path="/" element={<Navigate to="/welcome" />} />
            </Routes>
        </div>
    );
};

export default App;