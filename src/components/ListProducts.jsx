import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductByIdMutation } from '../features/api/apiSlice';
import SkeletonRow from './SkeletonRow';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './ToastContext';

const ListProducts = () => {
  const { data: products = [], isLoading, isError, error, isFetching } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductByIdMutation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState({ open: false, id: null, name: '' });

  const addProduct = () => navigate('/addproduct');
  const view = (id) => navigate(`/viewProduct/${id}`);
  const update = (id) => navigate(`/updateProduct/${id}`);

  // Opens the premium dialog instead of window.confirm()
  const requestDelete = (id, name) => {
    setDialogState({ open: true, id, name });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(dialogState.id).unwrap();
      addToast(`Successfully deleted "${dialogState.name}"`, 'success');
    } catch (err) {
      addToast(`Failed to delete: ${err?.data?.message || 'Unknown error'}`, 'error');
    } finally {
      setDialogState({ open: false, id: null, name: '' });
    }
  };

  const handleCancelDelete = () => {
    setDialogState({ open: false, id: null, name: '' });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm)
  );

  return (
    <>
      <ConfirmDialog
        isOpen={dialogState.open}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        productName={dialogState.name}
        isLoading={isDeleting}
      />

      <div className="page-transition">
        <header className="header-actions">
          <h1 className="page-title">Product Directory</h1>
          <button id="add-product-btn" className="btn btn-primary" onClick={addProduct}>
            + Add Product
          </button>
        </header>

        <div style={{ marginBottom: 'var(--space-4)', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading || isFetching) && products.length === 0 ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : isError ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-danger)' }}>
                    Error loading products: {error?.data?.message || error?.error || 'Unknown error'}
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '16px', marginBottom: 'var(--space-2)' }}>No products found.</div>
                    <button className="btn btn-secondary" onClick={addProduct}>Create your first product</button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{product.id}</span>
                    </td>
                    <td><strong>{product.name}</strong></td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>
                      <span className={`qty-badge ${product.quantity < 10 ? 'qty-low' : 'qty-ok'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => view(product.id)}>
                          View
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => update(product.id)}>
                          Edit
                        </button>
                        <button
                          id={`delete-btn-${product.id}`}
                          className="btn btn-danger btn-sm"
                          onClick={() => requestDelete(product.id, product.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListProducts;
