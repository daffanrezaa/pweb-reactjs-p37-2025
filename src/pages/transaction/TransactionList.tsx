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
        return <div style={{ textAlign: 'center', padding: '50px' }}>Load My Transactions</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>;
    }

    if (transactions.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>You dont have any transactions!</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2>My Transactions</h2>
            {transactions.map((tx) => (
                <div 
                    key={tx.id} 
                    style={{ 
                        border: '1px solid #ddd', 
                        padding: '15px', 
                        marginBottom: '10px',
                        cursor: 'pointer' 
                    }}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                >
                    <p><strong>Transaction ID:</strong> {tx.id}</p>
                    <p><strong>Date:</strong> {new Date(tx.createdAt).toLocaleDateString('id-ID')}</p>
                    <p><strong>Total Item:</strong> {tx.orderItems.length} jenis buku</p>
                    <p><strong>Total Price:</strong> Rp{calculateTotalOrder(tx.orderItems).toLocaleString('id-ID')}</p>
                    <small>Click for the details!</small>
                </div>
            ))}
        </div>
    );
};

export default TransactionsList;