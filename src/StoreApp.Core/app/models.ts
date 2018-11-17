declare module Models {

    export interface Store {
        id: number;
        name: string;
    }

    export interface StoreStock {
        storeid: number;
        storename: string;
    }

    export interface Size {
        size: number;
        stock: StoreStock[];
    }

    export interface Product {
        code: string;
        brand: string;
        title: string;
        description: string;
        image: string;
        price: string;
        saleprice: string;
        sizes: Size[];
        relatedproducts: string[];
    }

    export interface WishlistItem {
        store: Models.Store;
        product: Models.Product;
    }

    export interface Order {
        orderNumber: number;
        size: number;
        
        store: Models.Store;
        product: Models.Product;
    }
    
    export interface ActiveUser {
        userInfo: firebase.UserInfo,
        lastActive: number
    }

    export interface UserEvent {
        userInfo: firebase.UserInfo,
        product: Models.Product,
        message: string,
        timestamp: number
    }
}