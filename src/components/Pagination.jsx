import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;

  const { page = 1, totalPages = 1, total = 0 } = pagination;

  return (
    <div className="pagination-bar">
      <button
        className="btn btn-secondary btn-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        &larr; Previous
      </button>

      <span className="pagination-info">
        Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>{' '}
        <span className="text-muted">(Total: {total})</span>
      </span>

      <button
        className="btn btn-secondary btn-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next &rarr;
      </button>
    </div>
  );
}
