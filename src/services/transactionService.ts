import type { 
    OrderItemInput, 
    CheckoutSuccessResponse, 
    Book, 
    Transaction 
} from '../types/transaction'; // <-- UBAH IMPORT

const API_URL = import.meta.env.VITE_API_BASE_URL + '/transactions';
const BOOK_API_URL = import.meta.env.VITE_API_BASE_URL + '/books';

// Fungsi bantuan untuk mendapatkan Token
const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// =========================================================
// 1. Checkout (POST /transactions)
// =========================================================
export const createTransaction = async (items: OrderItemInput[]): Promise<CheckoutSuccessResponse> => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ items }), 
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to create transaction. Check stock availability.');
    }

    return data.data as CheckoutSuccessResponse;
};

// =========================================================
// 2. List Transaksi (GET /transactions)
// =========================================================
export const getAllTransactions = async (): Promise<Transaction[]> => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to fetch transaction list.');
    }
    
    // Asumsi API mengembalikan { success: true, data: [Transaction, ...] }
    return data.data as Transaction[];
};

// =========================================================
// 3. Detail Transaksi (GET /transactions/:id)
// =========================================================
export const getTransactionDetail = async (id: string): Promise<Transaction> => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to fetch transaction detail.');
    }
    
    // Asumsi API mengembalikan { success: true, data: Transaction }
    return data.data as Transaction;
};

// =========================================================
// 4. Fetch Buku (Diperlukan oleh Checkout)
// =========================================================
export const getAllBooks = async (): Promise<Book[]> => {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(BOOK_API_URL, { headers });
    
    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to fetch books for checkout.');
    }

    return data.data as Book[];
};