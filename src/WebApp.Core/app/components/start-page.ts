/// <amd-dependency path="text!./start-page.html" />
import * as $ from "jquery";
import * as ko from "knockout";
import { RepositoryStub } from "../repositoryStub";

export class StartPageViewModel {
    repo = new RepositoryStub();
    
    showIntroductionTour = ko.observable<boolean>(true).syncWith("showIntroductionTour", true, false);
    products = ko.observableArray<any>([]);
    wishlistitems = ko.observableArray<Models.WishlistItem>([]).syncWith("wishlistitems", true, false);
    orders = ko.observableArray<Models.Order>([]).syncWith("orders", true, false);
    currentStore = ko.observable<Models.Store>().subscribeTo("currentStore", true);

    constructor() { 
        $('.single-item').slick({
            dots: true 
        });

        this.repo.products()
            .then((products) => {
                products.forEach((product) => {
                    if(product.saleprice != "0") {
                        this.products.push(product);
                    }  
                });                
            });    
    }

    skipIntroductionTour = () => {
        this.showIntroductionTour(false)        
    }

    scanProduct = () => {
        alert("Product scanned");        
    }
}