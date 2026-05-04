import React from 'react';

const SkeletonRow = () => {
  return (
    <tr className="skeleton-row">
      <td><div className="skeleton-box" style={{ width: '30px' }}></div></td>
      <td><div className="skeleton-box" style={{ width: '150px' }}></div></td>
      <td><div className="skeleton-box" style={{ width: '60px' }}></div></td>
      <td><div className="skeleton-box" style={{ width: '40px', borderRadius: '12px' }}></div></td>
      <td>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <div className="skeleton-box" style={{ width: '50px', height: '30px', borderRadius: 'var(--radius-sm)' }}></div>
            <div className="skeleton-box" style={{ width: '50px', height: '30px', borderRadius: 'var(--radius-sm)' }}></div>
            <div className="skeleton-box" style={{ width: '60px', height: '30px', borderRadius: 'var(--radius-sm)' }}></div>
        </div>
      </td>
    </tr>
  );
};

export default SkeletonRow;
