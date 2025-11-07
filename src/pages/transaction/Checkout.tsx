import React, { useState, useEffect, useCallback } from 'react';
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
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

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


    // --- 4. Fungsi Checkout (POST /transactions) ---
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
            
            setCheckoutMessage(`Checkout succeeded! Total: Rp${response.total_price.toLocaleString('id-ID')}`);
            setCart(prevCart => prevCart.map(item => ({ ...item, quantity: 0 }))); 
            
            setTimeout(() => {
                navigate('/transactions');
            }, 2000);
            
        } catch (err: any) {
            setError(err.message || 'Transaksi gagal diproses.');
        } finally {
            setIsProcessing(false);
        }
    };


    // --- Conditional Rendering: Loading, Error, Empty State ---
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading data buku...</div>; 
    }

    if (error && !isProcessing) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>; 
    }

    if (books.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Katalog buku kosong. Tidak ada yang bisa di-checkout.</div>; 
    }

    // --- Tampilan Utama ---
    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2>Checkout Your Book Here!</h2>
            
            {checkoutMessage && (
                <div style={{ color: 'green', marginBottom: '20px', padding: '10px', border: '1px solid green' }}>
                    {checkoutMessage}
                </div>
            )}
            {error && isProcessing && (
                 <div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red' }}>
                    {error}
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
                        <th style={{ padding: '10px' }}>Price</th>
                        <th style={{ padding: '10px' }}>Available Stock</th>
                        <th style={{ padding: '10px' }}>Qty</th>
                        <th style={{ padding: '10px' }}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.bookId} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{item.title}</td>
                            <td style={{ textAlign: 'right', padding: '10px' }}>Rp{item.price.toLocaleString('id-ID')}</td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>{item.stock}</td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                <input
                                    type="number"
                                    min="0"
                                    max={item.stock}
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.bookId, parseInt(e.target.value))}
                                    style={{ width: '60px', textAlign: 'center' }}
                                    disabled={isProcessing}
                                />
                            </td>
                            <td style={{ textAlign: 'right', padding: '10px' }}>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <h3>Order Total: Rp{calculateTotal().toLocaleString('id-ID')}</h3>
                <button
                    onClick={handleCheckout}
                    disabled={isProcessing || calculateTotal() === 0}
                    style={{ 
                        padding: '10px 20px', 
                        fontSize: '16px', 
                        cursor: 'pointer',
                        backgroundColor: (isProcessing || calculateTotal() === 0) ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    {isProcessing ? 'Process...' : 'Checkout Now'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;