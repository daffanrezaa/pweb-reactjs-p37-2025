// src/pages/transaction/TransactionDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionDetail } from '../../services/transactionService';
import type { Transaction } from '../../types/transaction';

const TransactionDetail: React.FC = () => {
    const { transaction_id } = useParams<{ transaction_id: string }>(); // Ambil ID dari URL
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!transaction_id) {
            setError('ID Transaksi tidak ditemukan.');
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            try {
                const data = await getTransactionDetail(transaction_id);
                setTransaction(data);
            } catch (err: any) {
                setError(err.message || 'Gagal memuat detail transaksi.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [transaction_id]);

    const calculateItemSubtotal = (price: number, quantity: number) => price * quantity;
    
    const calculateGrandTotal = () => {
        if (!transaction) return 0;
        return transaction.orderItems.reduce((sum, item) => sum + calculateItemSubtotal(item.book.price, item.quantity), 0);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Load Transaction Details...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>;
    }

    if (!transaction) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>The transaction details not found.</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <button onClick={() => navigate('/transactions')} style={{ marginBottom: '15px', padding: '8px 15px' }}>
                &larr; Back
            </button>
            
            <h2>Transaction Details: {transaction.id.substring(0, 8)}...</h2>
            
            <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <p><strong>Buyer:</strong> {transaction.user.username} ({transaction.user.email})</p>
                <p><strong>Transaction Date:</strong> {new Date(transaction.createdAt).toLocaleString('id-ID')}</p>
                <p><strong>Total Item:</strong> {transaction.orderItems.length} jenis</p>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Book</th>
                        <th style={{ padding: '10px' }}>Price</th>
                        <th style={{ padding: '10px' }}>Qty</th>
                        <th style={{ padding: '10px' }}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {transaction.orderItems.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>
                                <strong>{item.book.title}</strong>
                                <br/><small>Author: {item.book.writer || 'N/A'}</small>
                            </td>
                            <td style={{ textAlign: 'right', padding: '10px' }}>Rp{item.book.price.toLocaleString('id-ID')}</td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right', padding: '10px' }}>Rp{calculateItemSubtotal(item.book.price, item.quantity).toLocaleString('id-ID')}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ borderTop: '2px solid #333', fontWeight: 'bold' }}>
                        <td colSpan={3} style={{ textAlign: 'right', padding: '10px' }}>Order Total</td>
                        <td style={{ textAlign: 'right', padding: '10px' }}>Rp{calculateGrandTotal().toLocaleString('id-ID')}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default TransactionDetail;