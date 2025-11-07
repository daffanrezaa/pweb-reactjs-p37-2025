// src/pages/transaction/TransactionList.tsx
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
        return <div style={{ textAlign: 'center', padding: '50px' }}>Memuat riwayat transaksi...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>;
    }

    if (transactions.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Anda belum memiliki riwayat transaksi.</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2>📋 Riwayat Transaksi Saya</h2>
            
            {/* Implementasi Search, Sort, Pagination di sini */}

            {transactions.map((tx) => (
                <div 
                    key={tx.id} 
                    style={{ 
                        border: '1px solid #ddd', 
                        padding: '15px', 
                        marginBottom: '10px',
                        cursor: 'pointer' 
                    }}
                    onClick={() => navigate(`/transactions/${tx.id}`)} // Arahkan ke Detail
                >
                    <p><strong>ID Transaksi:</strong> {tx.id}</p>
                    <p><strong>Tanggal:</strong> {new Date(tx.createdAt).toLocaleDateString('id-ID')}</p>
                    <p><strong>Total Item:</strong> {tx.orderItems.length} jenis buku</p>
                    <p><strong>Total Harga:</strong> Rp{calculateTotalOrder(tx.orderItems).toLocaleString('id-ID')}</p>
                    <small>Klik untuk melihat detail</small>
                </div>
            ))}
        </div>
    );
};

export default TransactionsList;