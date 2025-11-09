import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionDetail } from '../../services/transactionService';
import type { Transaction } from '../../types/transaction';

const TransactionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // CHANGED from transaction_id to id
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Transaction ID not found.');
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            try {
                const data = await getTransactionDetail(id);
                setTransaction(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load transaction details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const calculateItemSubtotal = (price: number, quantity: number) => price * quantity;
    
    const calculateGrandTotal = () => {
        if (!transaction) return 0;
        return transaction.orderItems.reduce(
            (sum, item) => sum + calculateItemSubtotal(item.book.price, item.quantity), 
            0
        );
    };

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
                <p>Loading transaction details...</p>
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
                <button 
                    onClick={() => navigate('/transactions')} 
                    style={{ 
                        marginBottom: '1.5rem', 
                        padding: '0.625rem 1.25rem',
                        cursor: 'pointer',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="19" y1="12" x2="5" y2="12" strokeWidth="2" strokeLinecap="round"/>
                        <polyline points="12 19 5 12 12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Transactions
                </button>
                
                <div style={{ 
                    color: '#991b1b', 
                    backgroundColor: '#fee2e2',
                    textAlign: 'center', 
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '1px solid #dc2626'
                }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ margin: '0 auto 1rem' }}>
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <h3>Transaction Not Found</h3>
                    <p>{error || 'The transaction you are looking for does not exist.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Back Button */}
            <button 
                onClick={() => navigate('/transactions')} 
                style={{ 
                    marginBottom: '1.5rem', 
                    padding: '0.625rem 1.25rem',
                    cursor: 'pointer',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="19" y1="12" x2="5" y2="12" strokeWidth="2" strokeLinecap="round"/>
                    <polyline points="12 19 5 12 12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Transactions
            </button>
            
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Transaction Details</h2>
                <p style={{ 
                    color: '#6b7280', 
                    margin: 0,
                    fontFamily: 'monospace',
                    fontSize: '0.9375rem'
                }}>
                    ID: {transaction.id}
                </p>
            </div>
            
            {/* Transaction Info Card */}
            <div style={{ 
                background: 'white',
                border: '2px solid #e5e7eb', 
                padding: '1.5rem', 
                marginBottom: '1.5rem', 
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem'
                }}>
                    <div>
                        <p style={{ 
                            margin: '0 0 0.5rem 0',
                            fontSize: '0.8125rem',
                            color: '#6b7280',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Buyer
                        </p>
                        <p style={{ 
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#111827'
                        }}>
                            {transaction.user.username}
                        </p>
                        <p style={{ 
                            margin: '0.25rem 0 0 0',
                            fontSize: '0.875rem',
                            color: '#6b7280'
                        }}>
                            {transaction.user.email}
                        </p>
                    </div>
                    
                    <div>
                        <p style={{ 
                            margin: '0 0 0.5rem 0',
                            fontSize: '0.8125rem',
                            color: '#6b7280',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Transaction Date
                        </p>
                        <p style={{ 
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#111827'
                        }}>
                            {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                        <p style={{ 
                            margin: '0.25rem 0 0 0',
                            fontSize: '0.875rem',
                            color: '#6b7280'
                        }}>
                            {new Date(transaction.createdAt).toLocaleTimeString('id-ID')}
                        </p>
                    </div>
                    
                    <div>
                        <p style={{ 
                            margin: '0 0 0.5rem 0',
                            fontSize: '0.8125rem',
                            color: '#6b7280',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Total Items
                        </p>
                        <p style={{ 
                            margin: 0,
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#3B572F'
                        }}>
                            {transaction.orderItems.length} 
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                                {' '}book{transaction.orderItems.length !== 1 ? 's' : ''}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Order Items Table */}
            <div style={{ 
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflowX: 'auto',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ 
                    marginBottom: '1rem',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#111827'
                }}>
                    Order Items
                </h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ 
                                textAlign: 'left', 
                                padding: '12px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Book
                            </th>
                            <th style={{ 
                                padding: '12px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textAlign: 'right'
                            }}>
                                Price
                            </th>
                            <th style={{ 
                                padding: '12px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textAlign: 'center'
                            }}>
                                Qty
                            </th>
                            <th style={{ 
                                padding: '12px',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textAlign: 'right'
                            }}>
                                Subtotal
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.orderItems.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '12px' }}>
                                    <p style={{ 
                                        margin: '0 0 0.25rem 0',
                                        fontWeight: 600,
                                        fontSize: '0.9375rem',
                                        color: '#111827'
                                    }}>
                                        {item.book.title}
                                    </p>
                                    <p style={{ 
                                        margin: 0,
                                        fontSize: '0.8125rem',
                                        color: '#6b7280'
                                    }}>
                                        {item.book.writer || 'Unknown Author'}
                                    </p>
                                </td>
                                <td style={{ 
                                    textAlign: 'right', 
                                    padding: '12px',
                                    color: '#374151',
                                    fontSize: '0.9375rem'
                                }}>
                                    Rp{item.book.price.toLocaleString('id-ID')}
                                </td>
                                <td style={{ 
                                    textAlign: 'center', 
                                    padding: '12px',
                                    fontSize: '0.9375rem',
                                    fontWeight: 600,
                                    color: '#111827'
                                }}>
                                    {item.quantity}
                                </td>
                                <td style={{ 
                                    textAlign: 'right', 
                                    padding: '12px',
                                    fontWeight: 600,
                                    fontSize: '0.9375rem',
                                    color: '#111827'
                                }}>
                                    Rp{calculateItemSubtotal(item.book.price, item.quantity).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{ borderTop: '2px solid #3B572F' }}>
                            <td colSpan={3} style={{ 
                                textAlign: 'right', 
                                padding: '16px 12px',
                                fontWeight: 700,
                                fontSize: '1.125rem',
                                color: '#111827'
                            }}>
                                Order Total
                            </td>
                            <td style={{ 
                                textAlign: 'right', 
                                padding: '16px 12px',
                                fontWeight: 700,
                                fontSize: '1.25rem',
                                color: '#3B572F'
                            }}>
                                Rp{calculateGrandTotal().toLocaleString('id-ID')}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default TransactionDetail;