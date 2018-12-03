import { IRepository } from "./IRepository";

export class RepositoryStub implements IRepository {
  public async getProducts(): Promise<Models.Product[]> {
    var response = await window.fetch(`/data/products.json`);
    return response.json();
  }

  public async getProduct(code: string): Promise<Models.Product> {
    var products = await this.getProducts();
    return products.find(product => {
      return product.code === code;
    });
  }

  public async getStores(): Promise<Models.Store[]> {
    var response = await window.fetch(`/data/stores.json`);
    return response.json();
  }

  public async getStore(code: string): Promise<Models.Store> {
    var stores = await this.getStores();
    return stores.find(store => {
      return store.code === code;
    });
  }

  public createOrder(
    store: Models.Store,
    product: Models.Product,
    size: string,
    type: Models.OrderType
  ): Models.Order {
    return {
      orderNumber: Math.ceil(Math.random() * 1000),
      size: size,
      store: store,
      product: product,
      type: type
    };
  }

  /* SERVICE API */
  public async getServiceApiToken(): Promise<any> {
    return new Promise(function(resolve, reject) {
      resolve("API KEY");
    });
  }

  public async getCurrentCustomer(contactId: string): Promise<Models.Contact> {
    return (await this.customers())[0];
  }

  public async getShippingOptions(): Promise<PaymentShippingOption[]> {
    var response = await this.shippingOptions();
    const options: PaymentShippingOption[] = [];
    response.forEach((item: any) => {
      options.push({
        id: item.id,
        label: item.displayName,
        amount: {
          currency: item.price.currency,
          value: item.price.amount.toString()
        }
      });
    });
    return options;
  }

  /* CONTENT DELIVERY API */
  public async getPageContent(page: number): Promise<any> {
    return (await this.pages())[0];
  }

  public async trackEvent(
    contact: Models.Contact,
    eventType: string,
    value?: string,
    data?: any
  ): Promise<any> {
    console.log(
      "Track event " +
        eventType +
        " - " +
        value +
        " for customer " +
        contact.email
    );
  }

  private async customers(): Promise<Models.Contact[]> {
    var response = await window.fetch(`/data/customers.json`);
    return response.json();
  }

  private async pages(): Promise<Models.StorePage[]> {
    var response = await window.fetch(`/data/pages.json`);
    return response.json();
  }

  private async shippingOptions(): Promise<any[]> {
    var response = await window.fetch(`/data/shipping-options.json`);
    return response.json();
  }

  public async getNumberOfVisitsThisMonth(
    contact: Models.Contact,
    store: Models.Store
  ): Promise<any> {
    return new Promise(function(resolve, reject) {
      resolve(4);
    });
  }
}
