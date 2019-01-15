import * as ko from "knockout";
import { MainViewModel } from "./main";
import { ProductCouponDialogViewModel } from "./components/product-coupon-dialog";
import { StockSizesViewModel } from "./components/stock-sizes";
import { MenuCartViewModel } from "./components/menu-cart";
import { LoginPageViewModel } from "./components/login-page";
import { SignupPageViewModel } from "./components/signup-page";
import { StartPageViewModel } from "./components/start-page";
import { ProductDetailPageViewModel } from "./components/product-detail-page";
import { NavMenuViewModel } from "./components/nav-menu";
import { WishlistViewModel } from "./components/wishlist-page";
import { MyOrdersViewModel } from "./components/myorders-page";
import { NfcViewModel } from "./components/nfc-page";
import { ArViewModel } from "./components/ar/ar-page";
import * as $ from "jquery";
import { PaymentRequestPageViewModel } from "./components/payment-request/payment-request-page";

// register knockout components
ko.components.register("product-coupon-dialog", {
  viewModel: ProductCouponDialogViewModel,
  template: { require: "text!components/product-coupon-dialog.html" }
});
ko.components.register("stock-sizes", {
  viewModel: StockSizesViewModel,
  template: { require: "text!components/stock-sizes.html" }
});
ko.components.register("menu-cart", {
  viewModel: MenuCartViewModel,
  template: { require: "text!components/menu-cart.html" }
});
ko.components.register("login-page", {
  viewModel: LoginPageViewModel,
  template: { require: "text!components/login-page.html" }
});
ko.components.register("signup-page", {
  viewModel: SignupPageViewModel,
  template: { require: "text!components/signup-page.html" }
});
ko.components.register("start-page", {
  viewModel: StartPageViewModel,
  template: { require: "text!components/start-page.html" }
});
ko.components.register("product-detail-page", {
  viewModel: ProductDetailPageViewModel,
  template: { require: "text!components/product-detail-page.html" }
});
ko.components.register("nav-menu", {
  viewModel: NavMenuViewModel,
  template: { require: "text!components/nav-menu.html" }
});
ko.components.register("wishlist-page", {
  viewModel: WishlistViewModel,
  template: { require: "text!components/wishlist-page.html" }
});
ko.components.register("myorders-page", {
  viewModel: MyOrdersViewModel,
  template: { require: "text!components/myorders-page.html" }
});
ko.components.register("nfc-page", {
  viewModel: NfcViewModel,
  template: { require: "text!components/nfc-page.html" }
});
ko.components.register("payment-request-page", {
  viewModel: PaymentRequestPageViewModel,
  template: {
    require: "text!components/payment-request/payment-request-page.html"
  }
});
ko.components.register("ar-page", {
  viewModel: ArViewModel,
  template: { require: "text!components/ar/ar-page.html" }
});

// Start our app
var mainViewModel = new MainViewModel();
ko.applyBindings(mainViewModel);

setTimeout(() => {
  mainViewModel.loading(false);
}, 2000);

// Just to test if it works
(<any>window).newProduct = (productId: string) => {
  const currentProductId = mainViewModel.lastScannedId();
  if (currentProductId !== productId) {
    mainViewModel.lastScannedId(productId);
    mainViewModel.loading(true);
    setTimeout(() => {
      mainViewModel.loading(false);
    }, 500);
  }
};
