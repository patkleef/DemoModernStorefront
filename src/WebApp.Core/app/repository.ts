import axios from "axios";

export class Repository {
  private baseUrl: string = "http://modernstorefront-quicksilver.localtest.me/";

  public getData(url: string): Promise<JSON> {
    return window
      .fetch(`https://physicalstoreintegrationapi.azurewebsites.net${url}`)
      .then(response => {
        return response.json();
      });
  }

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

  public createOrder(
    store: Models.Store,
    product: Models.Product,
    size: number
  ): Models.Order {
    return {
      orderNumber: Math.ceil(Math.random() * 1000),
      size: size,

      store: store,
      product: product
    };
  }

  /* SERVICE API */
  public async getServiceApiToken(): Promise<string> {
    const result = await axios.post(
      "http://modernstorefront-quicksilver.localtest.me/episerverapi/token",
      "grant_type=password&username=apiUser&password=Episerver#15"
    );
    return result.data.access_token;
  }

  /* CONTENT DELIVERY API */
  public async getPageContent(page: number): Promise<any> {
    var result = await axios.get(
      this.baseUrl + "api/episerver/v2.0/content/" + page,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en"
        }
      }
    );

    return result.data;
  }
}
