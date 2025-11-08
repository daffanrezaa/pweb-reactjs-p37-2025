import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTransactions } from '../../services/transactionService';
import type { Transaction } from '../../types/transaction';

const TransactionsList: React.FC = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        // Menghitung total harga dari semua item dalam satu pesanan
        return items.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
    };

    // --- Conditional Rendering: Loading, Error, Empty State ---
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading History...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>;
    }

    if (transactions.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h2>History</h2>
                <p>You don't have any transaction history yet!</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2>History</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>View your past transactions and orders</p>
            
            {transactions.map((tx) => (
                <div 
                    key={tx.id} 
                    style={{ 
                        border: '1px solid #ddd', 
                        padding: '15px', 
                        marginBottom: '10px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate(`/history/${tx.id}`)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#3B572F';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#ddd';
                    }}
                >
                    <p><strong>Transaction ID:</strong> {tx.id.substring(0, 8)}...</p>
                    <p><strong>Date:</strong> {new Date(tx.createdAt).toLocaleDateString('id-ID')}</p>
                    <p><strong>Total Items:</strong> {tx.orderItems.length} book(s)</p>
                    <p><strong>Total Price:</strong> Rp{calculateTotalOrder(tx.orderItems).toLocaleString('id-ID')}</p>
                    <small style={{ color: '#666' }}>Click to view details</small>
                </div>
            ))}
        </div>
    );
};

export default TransactionsList;