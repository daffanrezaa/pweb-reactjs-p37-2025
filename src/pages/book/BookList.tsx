import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllBooks } from '../../services/bookService';
import type { Book, BookListParams } from '../../types/book';
import './BookList.css';

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [condition, setCondition] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'publicationYear'>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, condition, sortBy, order, currentPage]);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: BookListParams = {
        search: searchTerm || undefined,
        condition: condition || undefined,
        sortBy,
        order,
        page: currentPage,
        limit: itemsPerPage,
      };
      
      const response = await getAllBooks(params);
      setBooks(response.data);
      
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setCondition('');
    setSortBy('title');
    setOrder('asc');
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionBadge = (cond?: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      new: { label: 'New', class: 'badge-new' },
      like_new: { label: 'Like New', class: 'badge-like-new' },
      good: { label: 'Good', class: 'badge-good' },
      fair: { label: 'Fair', class: 'badge-fair' },
      poor: { label: 'Poor', class: 'badge-poor' },
    };
    
    return badges[cond || ''] || { label: 'N/A', class: 'badge-default' };
  };

  if (loading && books.length === 0) {
    return (
      <div className="book-list-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      {/* Header */}
      <div className="book-list-header">
        <div>
          <h1>Book Catalog</h1>
          <p className="subtitle">Browse and manage our collection of {totalItems} books</p>
        </div>
        
        {isAuthenticated && (
          <button
            className="btn-add-book"
            onClick={() => navigate('/books/add')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add New Book
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="filters-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search by title, writer, or publisher..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search">Search</button>
          </div>
        </form>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="condition">Condition:</label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => { setCondition(e.target.value); setCurrentPage(1); }}
              className="filter-select"
            >
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortBy">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as 'title' | 'publicationYear'); setCurrentPage(1); }}
              className="filter-select"
            >
              <option value="title">Title</option>
              <option value="publicationYear">Publication Year</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="order">Order:</label>
            <select
              id="order"
              value={order}
              onChange={(e) => { setOrder(e.target.value as 'asc' | 'desc'); setCurrentPage(1); }}
              className="filter-select"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <button onClick={handleClearFilters} className="btn-clear">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
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

      {/* Books Grid */}
      {loading ? (
        <div className="loading-overlay">
          <div className="spinner-large"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2"/>
          </svg>
          <h3>No books found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="books-grid">
            {books.map((book) => {
              const conditionBadge = getConditionBadge(book.condition);
              return (
                <div
                  key={book.id}
                  className="book-card"
                  onClick={() => navigate(`/books/${book.id}`)}>
                    
                  {book.image && (
                    <div className="book-cover">
                      <img 
                         src={book.image} 
                         alt={book.title}
                         onError={(e) => {
                           e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                  )}

                  <div className="book-card-header">
                    <h3>{book.title}</h3>
                    {book.condition && (
                      <span className={`badge ${conditionBadge.class}`}>
                        {conditionBadge.label}
                      </span>
                    )}
                  </div>
                  
                  <div className="book-card-body">
                    <p className="book-writer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                        <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                      </svg>
                      {book.writer}
                    </p>
                    
                    <p className="book-genre">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2"/>
                      </svg>
                      {book.genre.name}
                    </p>
                    
                    <div className="book-card-footer">
                      <span className="book-price">{formatPrice(book.price)}</span>
                      <span className={`book-stock ${book.stockQuantity === 0 ? 'out-of-stock' : ''}`}>
                        Stock: {book.stockQuantity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;