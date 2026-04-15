import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../features/api/apiSlice';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: product, isLoading, isError, error } = useGetProductByIdQuery(id);

  const goBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return <div className="card text-center" style={{ padding: 'var(--space-12)' }}>Loading product data...</div>;
  }

  if (isError || !product) {
    return (
      <div className="card text-center" style={{ padding: 'var(--space-12)', borderColor: 'var(--color-danger)' }}>
        <h2 style={{ color: 'var(--color-danger)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          {error?.error || "We couldn't retrieve the details for this product ID."}
        </p>
        <button className="btn btn-primary" onClick={goBack}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title text-center">Product Details</h1>
      
      <div className="card">
        <h2 className="card-title">{product.name}</h2>
        
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label className="form-label">Product ID</label>
          <div style={{ padding: 'var(--space-2) 0', color: 'var(--color-text-main)' }}>
            {product.id}
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label className="form-label">Price</label>
          <div style={{ padding: 'var(--space-2) 0', color: 'var(--color-text-main)' }}>
            ${Number(product.price).toFixed(2)}
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label className="form-label">Stock Quantity</label>
          <div style={{ padding: 'var(--space-2) 0', color: 'var(--color-text-main)' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: product.quantity > 0 ? 'rgba(54, 179, 126, 0.1)' : 'rgba(255, 86, 48, 0.1)',
              color: product.quantity > 0 ? 'var(--color-success)' : 'var(--color-danger)',
              fontWeight: '600'
            }}>
              {product.quantity} Units
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={goBack}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default Product;