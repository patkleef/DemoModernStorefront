import { IRepository } from "./IRepository";

export class RepositoryStub implements IRepository {
  public async products(): Promise<Models.Product[]> {
    var response = await window.fetch(`/data/products.json`);
    return response.json();
  }

  public async product(code: string): Promise<Models.Product> {
    var products = await this.products();
    return products.find(product => {
      return product.code === code;
    });
  }

  public async stores(): Promise<Models.Store[]> {
    var response = await window.fetch(`/data/stores.json`);
    return response.json();
  }

  public async store(id: number): Promise<Models.Store> {
    var stores = await this.stores();
    return stores.find(store => {
      return store.id === id;
    });
  }

  public async customers(): Promise<Models.Contact[]> {
    var response = await window.fetch(`/data/customers.json`);
    return response.json();
  }

  public async pages(): Promise<Models.StorePage[]> {
    var response = await window.fetch(`/data/pages.json`);
    return response.json();
  }

  public createOrder(
    store: Models.Store,
    product: Models.Product,
    size: number,
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

  public async getProducts(): Promise<Models.Product[]> {
    return await this.products();
  }

  /* CONTENT DELIVERY API */
  public async getPageContent(page: number): Promise<any> {
    return (await this.pages())[0];
  }

  public async trackEvent(
    contact: Models.Contact,
    eventType: string,
    value?: string
  ): Promise<any> {
    console.log("Track event");
  }
}
