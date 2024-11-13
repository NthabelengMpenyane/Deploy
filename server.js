const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2002',
    database: 'Wings_cafe'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.execute(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add user' });
        }
        res.status(201).json({ username, password });
    });
});

app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json(results);
    });
});


app.put('/api/users/:username', (req, res) => {
    const username = req.params.username;
    const { password } = req.body; 

    const query = 'UPDATE users SET password = ? WHERE username = ?';
    db.execute(query, [password, username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update user' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ username, password });
    });
});

app.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }

    Object.assign(product, updatedData);
    await product.save();
    res.status(200).send(product);
});

app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }

    await Product.deleteOne({ _id: productId });
    res.status(204).send();
});


app.post('/api/products', (req, res) => {
    const { name, description, quantity, price } = req.body;

    if (!name || quantity < 0 || price < 0) {
        return res.status(400).json({ error: 'Invalid product data' });
    }

    const sql = 'INSERT INTO products (name, description, quantity, price) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, description, quantity, price], (err, results) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ error: 'Failed to add product' });
        }

        const newProduct = {
            id: results.insertId, 
            name,
            description,
            quantity,
            price
        };
        res.status(201).json(newProduct);
    });
});

app.listen(5000 ,() => {
    console.log(`Server running on http://localhost:5000`);
});