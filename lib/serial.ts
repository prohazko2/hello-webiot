export class Serial {
  connected = false;

  /* TODO: move to config */
  interfaceNumber = 2;
  endpointIn = 5;
  endpointOut = 4;

  constructor(public device: USBDevice) {}

  async connect() {
    if (this.connected) {
      return;
    }
    await this.device.open();

    await this.device.selectConfiguration(1);

    const { interfaces } = this.device.configuration;
    for (const i of interfaces) {
      for (const a of i.alternates) {
        if (a.interfaceClass !== 0xff) {
          continue;
        }
        for (const e of a.endpoints) {
          if (e.direction == "out") {
            this.endpointOut = e.endpointNumber;
          }
          if (e.direction == "in") {
            this.endpointIn = e.endpointNumber;
          }
        }
      }
    }

    await this.device.claimInterface(this.interfaceNumber);
    await this.device.selectAlternateInterface(this.interfaceNumber, 0);
    await this.device.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x01,
      index: this.interfaceNumber,
    });
    this.connected = true;
  }

  async disconnect() {
    await this.device.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x00,
      index: this.interfaceNumber,
    });
    await this.device.close();
    //this.device = null;
    this.connected = false;
  }

  async *read() {
    console.log('start reading');
    
    await this.connect();
    for (;;) {
      const result = await this.device.transferIn(this.endpointIn, 64);
      yield result;
    }
  }

  write(data: BufferSource) {
    return this.device.transferOut(this.endpointOut, data);
  }
}
