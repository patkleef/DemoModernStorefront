export interface IRepository {
  getStores(): Promise<Models.Store[]>;
  getStore(code: string): Promise<Models.Store>;
  createOrder(
    store: Models.Store,
    product: Models.Product,
    size: string,
    type: Models.OrderType
  ): Models.Order;
  getServiceApiToken(): Promise<any>;
  getShippingOptions(): Promise<PaymentShippingOption[]>;
  getCurrentCustomer(contactId: string): Promise<Models.Contact>;
  getProducts(): Promise<Models.Product[]>;
  getProduct(code: string): Promise<Models.Product>;
  getPageContent(page: number): Promise<any>;
  trackEvent(
    contact: Models.Contact,
    eventType: string,
    value?: string,
    data?: any
  ): Promise<any>;
  getNumberOfVisitsThisMonth(
    contact: Models.Contact,
    store: Models.Store
  ): Promise<any>;
}
