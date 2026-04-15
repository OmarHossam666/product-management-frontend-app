import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsertProductMutation } from '../features/api/apiSlice';

const AddProduct = () => {
  const [product, setProduct] = useState({ id: '', name: '', price: '', quantity: '' });
  const navigate = useNavigate();
  const [insertProduct, { isLoading }] = useInsertProductMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      await insertProduct(product).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to save the product:', err);
      // Optional: Add toast error handling here
    }
  };

  const cancel = () => {
    navigate('/');
  };

  return (
    <div>
      <h1 className="page-title text-center">Add Product</h1>
      <div className="card">
        <form onSubmit={save}>
          <div className="form-group">
            <label className="form-label" htmlFor="id">Product ID</label>
            <input 
              type="number" 
              className="form-control" 
              id="id" 
              name="id"
              placeholder="Enter Product ID"
              value={product.id} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Product Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="name" 
              name="name"
              placeholder="Enter Product Name"
              value={product.name} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="price">Product Price</label>
            <input 
              type="number" 
              className="form-control" 
              id="price" 
              name="price"
              placeholder="Enter Product Price"
              value={product.price} 
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="quantity">Product Quantity</label>
            <input 
              type="number" 
              className="form-control" 
              id="quantity" 
              name="quantity"
              placeholder="Enter Product Quantity"
              value={product.quantity} 
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={cancel} disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
