export interface OrderItemInput {
    book_id: string; 
    quantity: number; 
}

export interface CheckoutSuccessResponse {
    transaction_id: string;
    total_quantity: number;
    total_price: number;
}

export interface Book {
    id: string;
    title: string;
    writer: string;
    publisher: string;
    price: number;
    stockQuantity: number;
    publicationYear: number;
    genreId: string;
    genre: {
        name: string;
    }
}

export interface TransactionItem {
    id: string;
    quantity: number;
    book: {
        title: string;
        price: number;
        writer?: string;
        publisher?: string;
    };
}

export interface Transaction {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    orderItems: TransactionItem[];
    user: {
        id: string;
        username: string;
        email: string;
    };
}