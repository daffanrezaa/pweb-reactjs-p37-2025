import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTransactions } from '../../services/transactionService';
import type { Transaction } from '../../types/transaction';

const TransactionsList: React.FC = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search & Sort States
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'items'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getAllTransactions();
                setTransactions(data);
            } catch (err: any) {
                setError(err.message || 'Gagal memuat riwayat transaksi.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const calculateTotalOrder = (items: any[]): number => {
        return items.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
    };

    // Filter & Sort Transactions
    const filteredAndSortedTransactions = useMemo(() => {
        let filtered = transactions.filter(tx => 
            tx.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            
            if (sortBy === 'date') {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (sortBy === 'amount') {
                const totalA = calculateTotalOrder(a.orderItems);
                const totalB = calculateTotalOrder(b.orderItems);
                comparison = totalA - totalB;
            } else if (sortBy === 'items') {
                comparison = a.orderItems.length - b.orderItems.length;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [transactions, searchTerm, sortBy, sortOrder]);

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
                <p>Loading transactions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                color: '#991b1b', 
                backgroundColor: '#fee2e2',
                textAlign: 'center', 
                padding: '2rem',
                margin: '2rem auto',
                maxWidth: '600px',
                borderRadius: '8px',
                border: '1px solid #dc2626'
            }}>
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Transaction History</h2>
                <p style={{ color: '#666', margin: 0 }}>
                    View your past transactions and orders ({transactions.length} total)
                </p>
            </div>

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
                        Search Transaction ID:
                    </label>
                    <input
                        type="text"
                        placeholder="Search by transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontFamily: 'monospace'
                        }}
                    />
                </div>

                {/* Sort By */}
                <div style={{ flex: '0 1 180px' }}>
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
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'items')}
                        style={{
                            width: '100%',
                            padding: '0.625rem 0.875rem',
                            border: '2px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="date">Date</option>
                        <option value="amount">Total Amount</option>
                        <option value="items">Number of Items</option>
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
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>

                {/* Clear Button */}
                <div style={{ flex: '0 1 auto', marginTop: 'auto' }}>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSortBy('date');
                            setSortOrder('desc');
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

            {/* Empty State or No Results */}
            {filteredAndSortedTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" style={{ margin: '0 auto 1rem' }}>
                        <circle cx="9" cy="21" r="1" strokeWidth="2"/>
                        <circle cx="20" cy="21" r="1" strokeWidth="2"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {transactions.length === 0 ? (
                        <>
                            <h2 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>No Transactions Yet</h2>
                            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>You haven't made any purchases yet!</p>
                            <button
                                onClick={() => navigate('/checkout')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#3B572F',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9375rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Start Shopping
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>No Results Found</h3>
                            <p style={{ color: '#9ca3af' }}>Try adjusting your search term</p>
                        </>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredAndSortedTransactions.map((tx) => (
                    <div 
                        key={tx.id} 
                        style={{ 
                            background: 'white',
                            border: '2px solid #e5e7eb', 
                            padding: '1.5rem', 
                            cursor: 'pointer',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => navigate(`/transactions/${tx.id}`)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,87,47,0.15)';
                            e.currentTarget.style.borderColor = '#3B572F';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            marginBottom: '1rem'
                        }}>
                            <div>
                                <p style={{ 
                                    margin: '0 0 0.25rem 0',
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                    fontWeight: 600
                                }}>
                                    TRANSACTION ID
                                </p>
                                <p style={{ 
                                    margin: 0,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#111827',
                                    fontFamily: 'monospace'
                                }}>
                                    {tx.id.substring(0, 12)}...
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ 
                                    margin: '0 0 0.25rem 0',
                                    fontSize: '0.875rem',
                                    color: '#6b7280',
                                    fontWeight: 600
                                }}>
                                    DATE
                                </p>
                                <p style={{ margin: 0, fontSize: '0.9375rem', color: '#374151' }}>
                                    {new Date(tx.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                            padding: '1rem',
                            background: '#f9fafb',
                            borderRadius: '8px'
                        }}>
                            <div>
                                <p style={{ 
                                    margin: '0 0 0.25rem 0',
                                    fontSize: '0.8125rem',
                                    color: '#6b7280',
                                    fontWeight: 600
                                }}>
                                    ITEMS
                                </p>
                                <p style={{ 
                                    margin: 0,
                                    fontSize: '1.125rem',
                                    fontWeight: 700,
                                    color: '#3B572F'
                                }}>
                                    {tx.orderItems.length} book{tx.orderItems.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ 
                                    margin: '0 0 0.25rem 0',
                                    fontSize: '0.8125rem',
                                    color: '#6b7280',
                                    fontWeight: 600
                                }}>
                                    TOTAL PRICE
                                </p>
                                <p style={{ 
                                    margin: 0,
                                    fontSize: '1.125rem',
                                    fontWeight: 700,
                                    color: '#3B572F'
                                }}>
                                    Rp{calculateTotalOrder(tx.orderItems).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                        
                        <div style={{ 
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#3B572F',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>
                            <span>View Details</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
};

export default TransactionsList;