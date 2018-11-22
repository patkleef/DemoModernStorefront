/// <amd-dependency path="text!./myorders-page.html" />
import * as ko from "knockout";
import * as GoogleMapsLoader from "google-maps";

export class MyOrdersViewModel {
  orders = ko.observableArray<Models.Order>().syncWith("orders", true, true);
  showGoogleMap = ko.observable(false);

  constructor() {
    document.getElementById("scroll-top").scrollIntoView();
  }

  showGoogleMapClick = () => {
    (<any>GoogleMapsLoader).KEY = "";
    GoogleMapsLoader.load(function(google) {
      var coordinates = { lat: 59.4401772, lng: 10.7000514 };
      var map = new google.maps.Map(
        document.getElementById("google-map-container"),
        { zoom: 12, center: coordinates }
      );

      var marker = new google.maps.Marker({
        position: coordinates,
        map: map
      });
    });
    this.showGoogleMap(true);
  };

  hideGoogleMapClick = () => {
    (<any>GoogleMapsLoader).release();
    this.showGoogleMap(false);
  };
}
