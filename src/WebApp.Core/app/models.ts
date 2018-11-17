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
    userInfo: firebase.UserInfo;
    lastActive: number;
  }

  export interface UserEvent {
    userInfo: firebase.UserInfo;
    product: Models.Product;
    message: string;
    timestamp: number;
  }

  export interface Contact {
    PrimaryKeyId: string;
    Addresses: Address[];
    FirstName: string;
    LastName: string;
    Email: string;
    RegistrationSource: string;
  }

  export interface Address {
    AddressId: string;
    Modified: string;
    Name: string;
    FirstName: string;
    LastName: string;
    CountryName: string;
    CountryCode: string;
    City: string;
    PostalCode: string;
    Line1: string;
    Line2: string;
    RegionName: string;
    RegionCode: string;
    Email: string;
    ShippingDefault: true;
    BillingDefault: true;
    DaytimePhoneNumber: string;
    EveningPhoneNumber: string;
    Organization: string;
  }
}
