import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction, getAllBooks } from '../../services/transactionService';
import type { OrderItemInput, Book, CheckoutSuccessResponse } from '../../types/transaction'; 

interface CartItem {
    bookId: string;
    title: string;
    price: number;
    stock: number;
    quantity: number; 
}

const Checkout: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

    // Search & Sort States
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'title' | 'price'>('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // --- 1. Fetch Daftar Buku untuk Tampilan ---
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const bookList = await getAllBooks();
                setBooks(bookList);
                
                const initialCart: CartItem[] = bookList.map(book => ({
                    bookId: book.id,
                    title: book.title,
                    price: book.price,
                    stock: book.stockQuantity,
                    quantity: 0
                }));
                setCart(initialCart);
            } catch (err: any) {
                setError(err.message || 'Gagal mengambil data buku.');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // --- 2. Handler Perubahan Kuantitas ---
    const handleQuantityChange = (bookId: string, quantity: number) => {
        const book = books.find(b => b.id === bookId);
        if (book && quantity > book.stockQuantity) {
            alert(`Stok untuk ${book.title} hanya ${book.stockQuantity}!`);
            quantity = book.stockQuantity;
        }
        if (quantity < 0) quantity = 0;

        setCart(prevCart => prevCart.map(item => 
            item.bookId === bookId ? { ...item, quantity: quantity } : item
        ));
    };

    // --- 3. Hitung Total Pembelian ---
    const calculateTotal = useCallback(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    // --- 4. Filter & Sort Cart ---
    const filteredAndSortedCart = useMemo(() => {
        let filtered = cart.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            
            if (sortBy === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (sortBy === 'price') {
                comparison = a.price - b.price;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [cart, searchTerm, sortBy, sortOrder]);

    // --- 5. Fungsi Checkout (POST /transactions) ---
    const handleCheckout = async () => {
        setError(null);
        setCheckoutMessage(null);
        
        const itemsToCheckout: OrderItemInput[] = cart
            .filter(item => item.quantity > 0)
            .map(item => ({
                book_id: item.bookId,
                quantity: item.quantity,
            }));

        if (itemsToCheckout.length === 0) {
            alert('Keranjang belanja kosong!');
            return;
        }

        setIsProcessing(true);
        try {
            const response: CheckoutSuccessResponse = await createTransaction(itemsToCheckout);
            
            setCheckoutMessage(
                `✅ Checkout succeeded! Transaction ID: ${response.transaction_id.substring(0, 8)}... | Total: Rp${response.total_price.toLocaleString('id-ID')}`
            );
            
            // Reset cart after successful checkout
            setCart(prevCart => prevCart.map(item => ({ ...item, quantity: 0 }))); 
            
            // DON'T auto-redirect - let user navigate manually
            
        } catch (err: any) {
            setError(err.message || 'Transaksi gagal diproses.');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Conditional Rendering: Loading, Error, Empty State ---
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    border: '4px solid #EDE8D0',
                    borderTopColor: '#3B572F',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 1rem'
                }}></div>
                <p>Loading books...</p>
            </div>
        ); 
    }

    if (error && !isProcessing) {
        return (
            <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        ); 
    }

    if (books.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Katalog buku kosong. Tidak ada yang bisa di-checkout.</p>
            </div>
        ); 
    }

    // --- Tampilan Utama ---
    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Shopping Cart</h2>
                <p style={{ color: '#666', margin: 0 }}>Select books and quantities for checkout</p>
            </div>
            
            {checkoutMessage && (
                <div style={{ 
                    color: '#065f46', 
                    backgroundColor: '#d1fae5',
                    marginBottom: '20px', 
                    padding: '1rem 1.25rem', 
                    border: '1px solid #059669',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {checkoutMessage}
                </div>
            )}
            
            {error && isProcessing && (
                 <div style={{ 
                    color: '#991b1b', 
                    backgroundColor: '#fee2e2',
                    marginBottom: '20px', 
                    padding: '1rem 1.25rem', 
                    border: '1px solid #dc2626',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {error}
                </div>
            )}

            {/* Search & Sort Controls */}
            <div style={{ 
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                {/* Search Input */}
                <div style={{ flex: '1 1 300px' }}>
                    <label style={{ 
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        Search Book:
                    </label>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>

                {/* Sort By */}
                <div style={{ flex: '0 1 150px' }}>
                    <label style={{ 
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        Sort By:
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'title' | 'price')}
                        style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="title">Title</option>
                        <option value="price">Price</option>
                    </select>
                </div>

                {/* Sort Order */}
                <div style={{ flex: '0 1 150px' }}>
                    <label style={{ 
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.5rem'
                    }}>
                        Order:
                    </label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                {/* Clear Button */}
                <div style={{ flex: '0 1 auto', marginTop: 'auto' }}>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSortBy('title');
                            setSortOrder('asc');
                        }}
                        style={{
                            padding: '0.625rem 1.25rem',
                            background: '#f3f4f6',
                            color: '#374151',
                            border: '2px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '1.7rem'
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Books Table */}
            <div style={{ 
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflowX: 'auto'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600, color: '#374151' }}>Title</th>
                            <th style={{ padding: '12px', fontWeight: 600, color: '#374151' }}>Price</th>
                            <th style={{ padding: '12px', fontWeight: 600, color: '#374151' }}>Stock</th>
                            <th style={{ padding: '12px', fontWeight: 600, color: '#374151' }}>Qty</th>
                            <th style={{ padding: '12px', fontWeight: 600, color: '#374151' }}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedCart.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                    No books found matching your search
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedCart.map((item) => (
                                <tr key={item.bookId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px', color: '#111827' }}>{item.title}</td>
                                    <td style={{ textAlign: 'right', padding: '12px', color: '#374151' }}>
                                        Rp{item.price.toLocaleString('id-ID')}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '12px', color: item.stock === 0 ? '#dc2626' : '#059669' }}>
                                        {item.stock}
                                    </td>
                                    <td style={{ textAlign: 'center', padding: '12px' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            max={item.stock}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.bookId, parseInt(e.target.value) || 0)}
                                            style={{ 
                                                width: '70px', 
                                                textAlign: 'center',
                                                padding: '0.375rem',
                                                border: '2px solid #d1d5db',
                                                borderRadius: '6px'
                                            }}
                                            disabled={isProcessing || item.stock === 0}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'right', padding: '12px', fontWeight: 500, color: '#111827' }}>
                                        Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Checkout Summary */}
            <div style={{ 
                textAlign: 'right', 
                marginTop: '1.5rem',
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginBottom: '1rem', color: '#111827' }}>
                    Order Total: Rp{calculateTotal().toLocaleString('id-ID')}
                </h3>
                <button
                    onClick={handleCheckout}
                    disabled={isProcessing || calculateTotal() === 0}
                    style={{ 
                        padding: '0.875rem 2rem', 
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: isProcessing || calculateTotal() === 0 ? 'not-allowed' : 'pointer',
                        backgroundColor: (isProcessing || calculateTotal() === 0) ? '#d1d5db' : '#3B572F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isProcessing ? '⏳ Processing...' : '🛒 Checkout Now'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;