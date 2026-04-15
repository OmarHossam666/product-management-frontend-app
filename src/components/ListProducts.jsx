import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../features/api/apiSlice';

const ListProducts = () => {
  const { data: products = [], isLoading, isError, error, isFetching } = useGetProductsQuery();
  const navigate = useNavigate();

  const addProduct = () => {
    navigate('/addproduct');
  };

  const view = (id) => {
    navigate(`/viewProduct/${id}`);
  };

  const remove = (id) => {
    navigate(`/deleteProduct/${id}`);
  };

  const update = (id) => {
    navigate(`/updateProduct/${id}`);
  };

  return (
    <div>
      <header className="header-actions">
        <h1 className="page-title">Product Directory</h1>
        <button className="btn btn-primary" onClick={addProduct}>
          + Add Product
        </button>
      </header>

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
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  Loading products...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-danger)' }}>
                  Error loading products: {error?.error || 'Unknown error'}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td><strong>{product.name}</strong></td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>
                    <span style={{ 
                        color: product.quantity < 10 ? 'var(--color-danger)' : 'inherit',
                        fontWeight: product.quantity < 10 ? '600' : 'normal'
                      }}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-secondary" onClick={() => view(product.id)}>
                        View
                      </button>
                      <button className="btn btn-secondary" onClick={() => update(product.id)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => remove(product.id)}>
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
  );
};

export default ListProducts;
