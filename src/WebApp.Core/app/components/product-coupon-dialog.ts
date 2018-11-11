/// <amd-dependency path="text!./product-coupon-dialog.html" />
import * as ko from "knockout";
import ViewModelBase from "./ViewModelBase";

export class ProductCouponDialogViewModel extends ViewModelBase {
    showCoupon = ko.observable<boolean>(false);
    
    clickClose=()=> {
        this.close();
    }
    
    close() {
        // cheating
        const testDialog = document.getElementById("readmore");
        (<any>testDialog).close();
    }

    constructor(params: {}) {
        super();
        ko.postbox.subscribe("ShowDialogTopic", () => {            
            const testDialog = document.getElementById("readmore");
            (<any>window).dialogPolyfill.registerDialog(testDialog);
            (<any>testDialog).showModal();
            testDialog.scrollIntoView();
        });

        ko.postbox.subscribe("CloseDialog", () => {
            var video = document.getElementById("video");
            (<any>video).stop();

            this.close();
        });
    }

    facebookShare = async () => {
        this.showCoupon(true);
    }

    addToMyCoupons = async () => {
        this.close();
    }
}
