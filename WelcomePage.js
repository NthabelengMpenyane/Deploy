import React from 'react';
import { useNavigate } from 'react-router-dom';
import './wings.css';

const WelcomePage = ({ setView }) => {
    const navigate = useNavigate();

const handleRegistrationClick = () => {
        navigate('/registration'); 
    };

    return (
        <div>
            <h1 id='welcome'>Welcome to Wings Cafe Inventory System</h1>
            <img src="/image/coffee.jpg" alt=""/>
            <p id='paragraph'>Feel the warmth at our cafe. </p>
            <button onClick={handleRegistrationClick}>Commence</button>
        </div>
    );
};
export default WelcomePage;