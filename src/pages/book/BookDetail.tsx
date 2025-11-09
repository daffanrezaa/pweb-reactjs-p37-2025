import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getBookById, deleteBook } from '../../services/bookService';
import type { Book } from '../../types/book';
import './BookDetail.css';

const BookDetail: React.FC = () => {
  const { book_id } = useParams<{ book_id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (book_id) {
      fetchBookDetail();
    }
  }, [book_id]);

  const fetchBookDetail = async () => {
    if (!book_id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getBookById(book_id);
      setBook(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book_id) return;
    
    setIsDeleting(true);
    try {
      await deleteBook(book_id);
      navigate('/', { replace: true });
    } catch (err: any) {
      alert(err.message || 'Failed to delete book');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionLabel = (condition?: string) => {
    const labels: Record<string, string> = {
      new: 'New',
      like_new: 'Like New',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
    };
    return labels[condition || ''] || 'N/A';
  };

  const getConditionClass = (condition?: string) => {
    const classes: Record<string, string> = {
      new: 'condition-new',
      like_new: 'condition-like-new',
      good: 'condition-good',
      fair: 'condition-fair',
      poor: 'condition-poor',
    };
    return classes[condition || ''] || 'condition-default';
  };

  if (loading) {
    return (
      <div className="book-detail-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-container">
        <div className="error-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h2>Book Not Found</h2>
          <p>{error || 'The book you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/')} className="btn-back">
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      {/* Back Button */}
      <button onClick={() => navigate('/')} className="btn-back-simple">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="19" y1="12" x2="5" y2="12" strokeWidth="2" strokeLinecap="round"/>
          <polyline points="12 19 5 12 12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Books
      </button>

      {/* Book Detail Card */}
      <div className="book-detail-card">
      {/* Header with Title and Actions */}
        {book.image && (
          <div className="book-detail-image">
            <img 
              src={book.image} 
              alt={book.title}
              onError={(e) => {
                e.currentTarget.parentElement!.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="book-detail-header">
          <div className="book-title-section">
            <h1>{book.title}</h1>
            {book.condition && (
              <span className={`condition-badge ${getConditionClass(book.condition)}`}>
                {getConditionLabel(book.condition)}
              </span>
            )}
          </div>
          
          {isAuthenticated && (
            <div className="book-actions">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-delete"
                disabled={isDeleting}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Book Information Grid */}
        <div className="book-info-grid">
          {/* Left Column - Main Info */}
          <div className="info-section">
            <h3>Book Information</h3>
            
            <div className="info-item">
              <span className="info-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                  <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                </svg>
                Writer
              </span>
              <span className="info-value">{book.writer}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Publisher
              </span>
              <span className="info-value">{book.publisher}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2"/>
                </svg>
                Genre
              </span>
              <span className="info-value">{book.genre.name}</span>
            </div>

            {book.publicationYear && (
              <div className="info-item">
                <span className="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Publication Year
                </span>
                <span className="info-value">{book.publicationYear}</span>
              </div>
            )}

            {book.isbn && (
              <div className="info-item">
                <span className="info-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" strokeWidth="2"/>
                    <path d="M3 7l2-5h14l2 5" strokeWidth="2"/>
                    <line x1="9" y1="11" x2="9" y2="16" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="15" y1="11" x2="15" y2="16" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  ISBN
                </span>
                <span className="info-value">{book.isbn}</span>
              </div>
            )}
          </div>

          {/* Right Column - Price & Stock */}
          <div className="info-section">
            <h3>Availability & Pricing</h3>
            
            <div className="price-card">
              <span className="price-label">Price</span>
              <span className="price-value">{formatPrice(book.price)}</span>
            </div>

            <div className="stock-card">
              <span className="stock-label">Stock Available</span>
              <span className={`stock-value ${book.stockQuantity === 0 ? 'out-of-stock' : ''}`}>
                {book.stockQuantity} {book.stockQuantity === 1 ? 'unit' : 'units'}
              </span>
              {book.stockQuantity === 0 && (
                <span className="out-of-stock-badge">Out of Stock</span>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        {book.description && (
          <div className="description-section">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => !isDeleting && setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="#c53030"/>
                <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" strokeLinecap="round" stroke="#c53030"/>
                <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" stroke="#c53030"/>
              </svg>
              <h2>Delete Book</h2>
              <p>Are you sure you want to delete "<strong>{book.title}</strong>"?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-confirm-delete"
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-small"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Book'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;