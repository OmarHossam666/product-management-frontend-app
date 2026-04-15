import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useDeleteProductByIdMutation } from '../features/api/apiSlice';

const DeleteProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: product, isLoading: isFetching, isError, error } = useGetProductByIdQuery(id);
  const [deleteProductMutation, { isLoading: isDeleting }] = useDeleteProductByIdMutation();
  
  const [isDeleted, setIsDeleted] = useState(false);
  const [deletedSnapshot, setDeletedSnapshot] = useState(null);

  const confirmDelete = async () => {
    try {
      setDeletedSnapshot(product);
      
      await deleteProductMutation(id).unwrap();
      setIsDeleted(true);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const cancel = () => {
    navigate('/');
  };

  if (isDeleted && deletedSnapshot) {
    return (
      <div className="card text-center" style={{ padding: 'var(--space-12)' }}>
        <h2 style={{ color: 'var(--color-success)', marginBottom: 'var(--space-4)' }}>Product Successfully Deleted</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          {deletedSnapshot.name} (ID: {deletedSnapshot.id}) has been permanently removed from the database.
        </p>
        <button className="btn btn-primary" onClick={cancel}>Return to Dashboard</button>
      </div>
    );
  }

  if (isFetching) {
    return <div className="card text-center" style={{ padding: 'var(--space-12)' }}>Loading product data...</div>;
  }

  if (isError || !product) {
    return (
      <div className="card text-center" style={{ padding: 'var(--space-12)', borderColor: 'var(--color-danger)' }}>
        <h2 style={{ color: 'var(--color-danger)' }}>Cannot Find Product</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          {error?.error || "We couldn't retrieve this product from the database."}
        </p>
        <button className="btn btn-primary" onClick={cancel}>Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title text-center">Delete confirmation</h1>
      
      <div className="card" style={{ borderColor: 'var(--color-danger)' }}>
        <h2 className="card-title" style={{ color: 'var(--color-danger)' }}>Warning: Irreversible Action</h2>
        <p style={{ textAlign: 'center', marginBottom: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
          Are you sure you want to permanently delete <strong>{product.name}</strong> from the database? This action cannot be undone.
        </p>
        
        <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontWeight: '500' }}>Product ID:</span>
            <span>{product.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontWeight: '500' }}>Price:</span>
            <span>${Number(product.price).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Stock:</span>
            <span>{product.quantity} Units</span>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={cancel} disabled={isDeleting}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Confirm Deletion"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;