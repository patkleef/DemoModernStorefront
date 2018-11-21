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
    primaryKeyId: string;
    addresses: Address[];
    firstName: string;
    lastName: string;
    email: string;
    registrationSource: string;
  }

  export interface Address {
    addressId: string;
    modified: string;
    name: string;
    firstName: string;
    lastName: string;
    countryName: string;
    countryCode: string;
    city: string;
    postalCode: string;
    line1: string;
    line2: string;
    regionName: string;
    regionCode: string;
    email: string;
    shippingDefault: true;
    billingDefault: true;
    daytimePhoneNumber: string;
    eveningPhoneNumber: string;
    organization: string;
  }

  export interface User {
    Name: string;
    Email: string;
  }

  export interface TrackEvent {
    TrackId: string;
    DeviceId: string;
    EventType: string;
    EventTime: Date;
    Value: string;
    Scope: string;
    CountryCode: string;
    PageUri?: any;
    PageTitle?: any;
    RemoteAddress: string;
    Payload: any;
    User: User;
  }
}
