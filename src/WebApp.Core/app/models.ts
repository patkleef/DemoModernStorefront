declare module Models {
  export interface Store {
    code: string;
    name: string;
  }

  export interface StoreStock {
    storePageId: number;
    storeCode: string;
    storeName: string;
    available: number;
  }

  export interface Size {
    size: string;
    stock: StoreStock[];
  }

  export interface Product {
    code: string;
    brand: string;
    title: string;
    description: string;
    image: string;
    price: number;
    salePrice: number;
    sizes: Size[];
    relatedproducts: string[];
  }

  export interface WishlistItem {
    store: Models.Store;
    product: Models.Product;
  }

  export interface Order {
    orderNumber: string;
    size: string;
    store: Models.Store;
    product: Models.Product;
    type: OrderType;
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

  export interface StorePage extends Content {
    id: number;
    storeName: Property;
    header: Property;
    mainBody: Property;
    mainImage: Property;
  }

  export interface ContentLink {
    id: number;
    workId: number;
    guidValue: string;
    providerName?: any;
  }

  export interface Language {
    displayName: string;
    name: string;
  }

  export interface ExistingLanguage {
    displayName: string;
    name: string;
  }

  export interface MasterLanguage {
    displayName: string;
    name: string;
  }

  export interface ParentLink {
    id: number;
    workId: number;
    guidValue: string;
    providerName?: any;
  }

  export interface Category {
    value: any[];
    propertyDataType: string;
  }

  export interface Property {
    value: string;
    propertyDataType: string;
  }

  export interface Content {
    contentLink: ContentLink;
    name: string;
    language: Language;
    existingLanguages: ExistingLanguage[];
    masterLanguage: MasterLanguage;
    contentType: string[];
    parentLink: ParentLink;
    routeSegment: string;
    url?: any;
    changed: Date;
    created: Date;
    startPublish: Date;
    stopPublish?: any;
    saved: Date;
    status: string;
    category: Category;
    storeName: Property;
    header: Property;
    mainBody: Property;
  }

  export const enum OrderType {
    ClickAndCollect = 1,
    Standard = 2
  }
}
