export interface IRepository {
  products(): Promise<Models.Product[]>;
  product(code: string): Promise<Models.Product>;
  stores(): Promise<Models.Store[]>;
  store(id: number): Promise<Models.Store>;
  createOrder(
    store: Models.Store,
    product: Models.Product,
    size: number,
    type: Models.OrderType
  ): Models.Order;
  getServiceApiToken(): Promise<any>;
  getCurrentCustomer(contactId: string): Promise<Models.Contact>;
  getProducts(): Promise<Models.Product[]>;
  getPageContent(page: number): Promise<any>;
  trackEvent(
    contact: Models.Contact,
    eventType: string,
    value?: string
  ): Promise<any>;
}
