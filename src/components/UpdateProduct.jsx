import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../features/api/apiSlice';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: fetchedProduct, isLoading: isFetching, isError, error } = useGetProductByIdQuery(id);
  const [updateProductMutation, { isLoading: isUpdating }] = useUpdateProductMutation();
  
  const [product, setProduct] = useState({ id: id, name: '', price: '', quantity: '' });

  useEffect(() => {
    if (fetchedProduct) {
      setProduct(fetchedProduct);
    }
  }, [fetchedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const update = async (e) => {
    e.preventDefault();
    try {
      await updateProductMutation(product).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to update the product:', err);
    }
  };

  const cancel = () => {
    navigate('/');
  };

  if (isFetching) {
    return <div className="card text-center" style={{ padding: 'var(--space-12)' }}>Loading product data...</div>;
  }

  if (isError) {
    return <div className="card text-center" style={{ padding: 'var(--space-12)', color: 'var(--color-danger)' }}>Error loading product: {error?.error || 'Unknown error'}</div>;
  }

  return (
    <div>
      <h1 className="page-title text-center">Update Product</h1>
      <div className="card">
        <form onSubmit={update}>
          <div className="form-group">
            <label className="form-label" htmlFor="id">Product ID</label>
            <input 
              type="number" 
              className="form-control" 
              id="id" 
              name="id"
              value={product.id} 
              disabled
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
            <button type="button" className="btn btn-secondary" onClick={cancel} disabled={isUpdating}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
