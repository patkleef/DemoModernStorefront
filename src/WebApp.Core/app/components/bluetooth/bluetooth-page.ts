/// <amd-dependency path="text!./bluetooth-page.html" />
import * as ko from "knockout";
import ViewModelBase from "../ViewModelBase";

export class BlueToothViewModel extends ViewModelBase {
  bluetoothStatus = ko.observable();
  newMessage = ko.observable<string>();

  constructor() {
    super();
    this.bluetoothStatus("bluetooth" in (navigator as any));
  }

  readBatteryLevel() {
    var $target = document.getElementById("target");

    if (!("bluetooth" in (navigator as any))) {
      $target.innerText = "Bluetooth API not supported.";
      return;
    }

    (navigator as any).bluetooth
      .requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"]
      })
      .then(function(device) {
        return device.gatt.connect();
      })
      .then(function(server) {
        return server.getPrimaryService("battery_service");
      })
      .then(function(service) {
        return service.getCharacteristic("battery_level");
      })
      .then(function(characteristic) {
        return characteristic.readValue();
      })
      .then(function(value) {
        $target.innerHTML =
          "Battery percentage is <b>" + value.getUint8(0) + "</b>.";
      })
      .catch(function(error) {
        $target.innerText = error;
      });
  }
}
