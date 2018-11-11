export class RepositoryStub {
    public async products(): Promise<Models.Product[]> {
        var response = await window.fetch(`/data/products.json`);
        return response.json();
    }

    public async product(code: string): Promise<Models.Product> {
        var products = await this.products();
        return products.find((product) => { return product.code === code; });
    }

    public async stores(): Promise<Models.Store[]> {
        var response = await window.fetch(`/data/stores.json`);
        return response.json();
    }

    public async store(id: number): Promise<Models.Store> {
        var stores = await this.stores();
        return stores.find((store) => { return store.id === id; });
    }

    public createOrder(store: Models.Store, product: Models.Product, size: number): Models.Order {
        return {
            orderNumber: Math.ceil(Math.random() * 1000),
            size: size,
            
            store: store,
            product: product
        };
    }
}