import React, { useEffect, useState } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../api';
import './wings.css';

const ProductManagement = ({ products, setProducts, handleNewSale }) => {
    const [newProduct, setNewProduct] = useState({ name: '', description: '', quantity: 0, price: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [editProduct, setEditProduct] = useState(null);
    const [sellQuantity, setSellQuantity] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                console.log(data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [setProducts]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        console.log('Attempting to add product:', newProduct);
    
        if (!newProduct.name || newProduct.quantity < 0 || newProduct.price < 0) {
            alert("Fill all the provided fields");
            return;
        }
        try {
            const data = await addProduct(newProduct);
            console.log('Product added:', data);
            setProducts(prevProducts => [...prevProducts, data]); 
            setNewProduct({ name: '', description: '', quantity: 0, price: 0 });
        } catch (error) {
            console.error('Failed to add product:', error);
            alert('Error adding product: ' + error.message);
        }
    };

    const handleSell = async (id, quantity) => {
        const product = products.find(p => p.id === id);
        if (!product) {
            console.error("Product not found");
            return;
        }
        if (quantity > product.quantity) {
            alert(`Cannot sell more quantity than the available ${product.name}`);
            return;
        }
        if (quantity <= 0) {
            alert("Quantity must be greater than zero.");
            return;
        }

        const newQuantity = product.quantity - quantity;

        if (newQuantity === 0) {
            setProducts(products.filter(p => p.id !== id));
        } else {
            const updatedProducts = products.map(p =>
                p.id === id ? { ...p, quantity: newQuantity } : p
            );
            setProducts(updatedProducts);
        }

        setSellQuantity(0);
        handleNewSale(product.id, quantity, product);
    };

    const handleEditProduct = (product) => {
        console.log("Editing product:", product);
        setEditProduct(product);
        setNewProduct({ name: product.name, description: product.description, quantity: product.quantity, price: product.price });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        console.log("Updating product:", newProduct);

        if (!newProduct.name || newProduct.quantity < 0 || newProduct.price < 0) {
            alert("Fill all the provided fields");
            return;
        }

        try {
            await updateProduct(editProduct.id, newProduct);
            const updatedProducts = products.map(p =>
                p.id === editProduct.id ? { ...newProduct, id: editProduct.id } : p 
            );

            setProducts(updatedProducts);
            setEditProduct(null);
            setNewProduct({ name: '', description: '', quantity: 0, price: 0 });
            alert("Product updated successfully!"); // Feedback to user
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Error updating product: ' + error.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        console.log("Attempting to delete product with ID:", id);
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Error deleting product: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Product Management</h1>
            <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}>
                <input 
                    type="text" 
                    placeholder="Product Name" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
                />
                <input 
                    type="text" 
                    placeholder="Description" 
                    value={newProduct.description} 
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
                />
                <input 
                    type="number" 
                    placeholder="Quantity" 
                    value={newProduct.quantity} 
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })} 
                />
                <input 
                    type="number" 
                    placeholder="Price" 
                    value={newProduct.price} 
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} 
                />
                <button type="submit">{editProduct ? "Update Product" : "Add Product"}</button>
                {editProduct && <button type="button" onClick={() => setEditProduct(null)}>Cancel Edit</button>}
            </form>
            
            <h2>Search Product</h2>
            <input 
                type="text" 
                placeholder="Search" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <h2>Product List</h2>
            <table id='product-mng'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                        <th>Sell</th>
                    </tr>
                </thead>
                <tbody>
                    {products
                        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        value={sellQuantity} 
                                        onChange={(e) => setSellQuantity(parseInt(e.target.value) || 1)}                                        
                                        placeholder="Quantity"
                                        min="1"
                                    />
                                    <button onClick={() => handleSell(product.id, sellQuantity)} disabled={product.quantity <= 0}>
                                        Sell
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;