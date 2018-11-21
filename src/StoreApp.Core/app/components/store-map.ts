/// <amd-dependency path="text!./store-map.html" />
import * as $ from "jquery";
import * as ko from "knockout";

export class StoreMapViewModel {
  showFirstProduct = ko.observable(false);
  showSecondProduct = ko.observable(false);
  showThirdProduct = ko.observable(false);

  clickLogin = () => {};

  clickTest = () => {};

  constructor() {
    setTimeout(() => {
      /*firebaseActiveUsers.eventsArray.subscribe((newEvent) => {
                if(newEvent&& newEvent[0] && newEvent[0].product){
                    var event = newEvent[0];
                    
                    switch(event.product.code){
                        case "35872466":
                        this.showFirstProduct(true);
                        setTimeout(()=>{
                            this.showFirstProduct(false);
                        }, 3000);
                        break;
                        case "31672432":
                        this.showSecondProduct(true);
                        setTimeout(()=>{
                            this.showSecondProduct(false);
                        }, 3000);
                        break;
                        case "45672008":
                        this.showThirdProduct(true);
                        setTimeout(()=>{
                            this.showThirdProduct(false);
                        }, 3000);
                        break;
                        default:
                        this.showFirstProduct(true);
                        setTimeout(()=>{
                            this.showFirstProduct(false);
                        }, 3000);
                    }

                }
            const oldValue = this.showFirstProduct();
                
            });*/
    }, 2000);
  }
}
