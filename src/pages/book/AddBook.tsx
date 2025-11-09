import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook, getAllGenres } from '../../services/bookService';
import type { BookInput, Genre } from '../../types/book';
import './AddBook.css';

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BookInput>({
    title: '',
    writer: '',
    publisher: '',
    price: 0,
    stockQuantity: 0,
    genreId: '',
    image: '',
    isbn: '',
    description: '',
    publicationYear: undefined,
    condition: undefined,
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const data = await getAllGenres();
      setGenres(data);
    } catch (err: any) {
      setError('Failed to load genres');
    } finally {
      setLoadingGenres(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle number fields
    if (name === 'price' || name === 'stockQuantity' || name === 'publicationYear') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.writer.trim()) {
      setError('Writer is required');
      return;
    }
    if (!formData.publisher.trim()) {
      setError('Publisher is required');
      return;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (formData.stockQuantity < 0) {
      setError('Stock quantity cannot be negative');
      return;
    }
    if (!formData.genreId) {
      setError('Please select a genre');
      return;
    }

    setLoading(true);
    
    try {
      // Clean up optional fields
      const dataToSubmit: BookInput = {
        title: formData.title.trim(),
        writer: formData.writer.trim(),
        publisher: formData.publisher.trim(),
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        genreId: formData.genreId,
      };

      if (formData.isbn?.trim()) dataToSubmit.isbn = formData.isbn.trim();
      if (formData.description?.trim()) dataToSubmit.description = formData.description.trim();
      if (formData.publicationYear) dataToSubmit.publicationYear = formData.publicationYear;
      if (formData.condition) dataToSubmit.condition = formData.condition;
      if (formData.image?.trim()) dataToSubmit.image = formData.image.trim(); 

      const newBook = await createBook(dataToSubmit);
      navigate(`/books/${newBook.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  if (loadingGenres) {
    return (
      <div className="add-book-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-book-container">
      <button onClick={() => navigate('/')} className="btn-back-simple">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="19" y1="12" x2="5" y2="12" strokeWidth="2" strokeLinecap="round"/>
          <polyline points="12 19 5 12 12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Books
      </button>

      <div className="add-book-card">
        <div className="form-header">
          <h1>Add New Book</h1>
          <p>Fill in the details to add a new book to the catalog</p>
        </div>

        {error && (
          <div className="error-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="book-form">
          {/* Required Fields Section */}
          <div className="form-section">
            <h3>Basic Information <span className="required-badge">Required</span></h3>
            
            <div className="form-group">
              <label htmlFor="title">
                Book Title <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="writer">
                  Writer <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="writer"
                  name="writer"
                  value={formData.writer}
                  onChange={handleChange}
                  placeholder="Enter writer name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="publisher">
                  Publisher <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="Enter publisher name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">
                  Price (IDR) <span className="required-star">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="stockQuantity">
                  Stock Quantity <span className="required-star">*</span>
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity || ''}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="genreId">
                Genre <span className="required-star">*</span>
              </label>
              <select
                id="genreId"
                name="genreId"
                value={formData.genreId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="form-section">
            <h3>Additional Details <span className="optional-badge">Optional</span></h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN (e.g., 978-3-16-148410-0)"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="publicationYear">Publication Year</label>
                <input
                  type="number"
                  id="publicationYear"
                  name="publicationYear"
                  value={formData.publicationYear || ''}
                  onChange={handleChange}
                  placeholder="YYYY"
                  min="1000"
                  max={new Date().getFullYear()}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition || ''}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Book Cover Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  placeholder="https://cdn.gramedia.com/uploads/items/book-cover.jpg"
                  disabled={loading}
                />
                  <small className="input-hint">
                  Enter the URL of the book cover image
                  </small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description..."
                rows={5}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={loading}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Book...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeWidth="2"/>
                    <polyline points="17 21 17 13 7 13 7 21" strokeWidth="2"/>
                    <polyline points="7 3 7 8 15 8" strokeWidth="2"/>
                  </svg>
                  Add Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;