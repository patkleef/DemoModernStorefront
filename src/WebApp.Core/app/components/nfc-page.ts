/// <amd-dependency path="text!./nfc-page.html" />
import * as ko from "knockout";
import ViewModelBase from "./ViewModelBase";

export class NfcViewModel extends ViewModelBase {
  nfcAccessStatus = ko.observable("unknown");
  newMessage = ko.observable<string>();
  messages = ko.observableArray<INfcMessage>([
    new ReadMessage("Message's will appear here")
  ]);

  constructor() {
    super();
    this.nfcAccessStatus("nfc" in navigator ? "available" : "not available");
    this.readNfc();
  }

  write() {
    var message = this.newMessage();
    this.newMessage("");
    $("#write-message").blur();
    this.nfcAccessStatus(`waiting to write: ${message}`);

    var nfcMessage = createNfcMessage(message);

    (navigator as any).nfc
      .push(nfcMessage)
      .then(() => {
        consoleLog("Message pushed.", message);
        this.messages.unshift(new WriteMessage(`Write: ${message}`, true));
      })
      .catch(error => {
        consoleLog("Message push failed.", message);
        this.messages.unshift(
          new WriteMessage(`Write failed: ${message}`, false)
        );
      })
      .finally(() => {
        this.nfcAccessStatus("available");
        $("#message-list li")[0].scrollIntoView();
      });
  }

  readNfc() {
    if ("nfc" in navigator) {
      (navigator as any).nfc
        .watch(
          message => {
            consoleLog("NFC message received", message);
            var items = message.records || message.data;
            items.forEach(record => {
              if (record.recordType == "text") {
                consoleLog("Record type text: " + record.data);
                this.messages.unshift(new ReadMessage(`Read: ${record.data}`));
              } else {
                consoleLog("Record type unknown: " + record.data);
              }
            });
            $("#message-list li")[0].scrollIntoView();
          },
          { mode: "any" }
        )
        .then(() => consoleLog("Added a watch."))
        .catch(err => consoleLog("Adding watch failed: " + err.name));
    } else {
      consoleLog("NFC API not supported.");
    }
  }
}

function createNfcMessage(message: string) {
  return {
    records: [
      {
        recordType: "text",
        mediaType: "text/plain",
        data: message || "empty"
      }
    ]
  };
}

function consoleLog(...data) {
  console.log(data);
}

interface INfcMessage {
  message: string;
  time: Date;
  isWrite: boolean;
  isSuccess: boolean;
}

class ReadMessage implements INfcMessage {
  message: string;
  time: Date;
  isWrite: false;
  isSuccess: true;
  constructor(message: string, time: Date = new Date()) {
    this.message = message;
    this.time = time;
    this.isWrite = false;
    this.isSuccess = true;
  }
}
class WriteMessage implements INfcMessage {
  message: string;
  time: Date;
  isWrite: true;
  isSuccess: boolean;
  constructor(message: string, isSuccess: boolean) {
    this.message = message;
    this.time = new Date();
    this.isWrite = true;
    this.isSuccess = isSuccess;
  }
}
