import { useProductsController } from '../controller/useProductsController';
import styles from '../css/ProductsPage.module.css';

export function ProductsPage() {
  const {
    products,
    total,
    page,
    totalPages,
    isLoading,
    isError,
    isMutating,
    editingId,
    register,
    errors,
    submit,
    startCreate,
    startEdit,
    handleDelete,
    nextPage,
    prevPage,
  } = useProductsController();

  return (
    <div className="container">
      <h1 className="h3 mb-3">Products (CRUD)</h1>

      {isLoading && <div className="spinner-border" role="status" />}
      {isError && <div className="alert alert-danger">Could not load products.</div>}

      {products && (
        <div className={styles.layout}>
          {/* Column 1: table + pagination */}
          <div>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.title}</td>
                    <td>${p.price}</td>
                    <td>{p.category}</td>
                    <td>{p.stock}</td>
                    <td className="text-nowrap">
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => startEdit(p.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.id)}
                        disabled={isMutating}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={prevPage}
                disabled={page === 0}
              >
                Previous
              </button>
              <span className="small text-muted">
                Page {page + 1} of {totalPages} ({total} products)
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={nextPage}
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>

          {/* Column 2: create / edit form (validated with react-hook-form + zod) */}
          <form className={`card p-3 ${styles.form}`} onSubmit={submit} noValidate>
            <h5 className="mb-3">{editingId === null ? 'New product' : `Edit #${editingId}`}</h5>

            <div className="mb-2">
              <label className="form-label">Title</label>
              <input
                className={`form-control${errors.title ? ' is-invalid' : ''}`}
                {...register('title')}
              />
              {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
            </div>
            <div className="mb-2">
              <label className="form-label">Price</label>
              <input
                type="number"
                step="any"
                className={`form-control${errors.price ? ' is-invalid' : ''}`}
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
            </div>
            <div className="mb-2">
              <label className="form-label">Category</label>
              <input
                className={`form-control${errors.category ? ' is-invalid' : ''}`}
                {...register('category')}
              />
              {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Stock</label>
              <input
                type="number"
                className={`form-control${errors.stock ? ' is-invalid' : ''}`}
                {...register('stock', { valueAsNumber: true })}
              />
              {errors.stock && <div className="invalid-feedback">{errors.stock.message}</div>}
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary flex-grow-1" disabled={isMutating}>
                {editingId === null ? 'Create' : 'Save'}
              </button>
              {editingId !== null && (
                <button type="button" className="btn btn-outline-secondary" onClick={startCreate}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
