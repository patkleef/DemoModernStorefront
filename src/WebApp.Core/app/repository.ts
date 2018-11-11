 export class Repository {
     public getData(url: string): Promise<JSON> {
        return window.fetch(`https://physicalstoreintegrationapi.azurewebsites.net${url}`)
            .then((response) => {
                return response.json();
            });
    }
};