import { h, Component, FunctionComponent, render } from "preact";

import { Serial } from "../../lib/serial";
import { requestDevice } from "../../lib/usb";

let serial: Serial = null;

class App extends Component<any, { response: string; connected: boolean }> {
  state = {
    response: "",
    connected: false,
  };

  async connect() {
    let [d] = await navigator.usb.getDevices();
    if (!d) {
      d = await requestDevice();
    }

    serial = new Serial(d);

    await serial.connect();
    this.setState({ connected: true, response: "" });

    try {
      for await (const { status, data } of serial.read()) {
        let response = status.toString();
        if (data) {
          response = `${response}: ${new TextDecoder().decode(data)}`;
        }
        this.setState({ response });
      }
    } catch (err) {
      console.log("serail read loop err", err);
      this.setState({ response: `err: ${err.toString()}` });
    }

    this.setState({ connected: false });
  }

  async disconnect() {
    await serial?.disconnect();
    this.setState({ connected: false });
  }

  async ledOn() {
    await serial?.write(new TextEncoder().encode("H"));
  }

  async ledOff() {
    await serial?.write(new TextEncoder().encode("L"));
  }

  render() {
    const { connected, response } = this.state;
    return (
      <div>
        {connected ? (
          <button onClick={() => this.disconnect()}>disconnect</button>
        ) : (
          <button onClick={() => this.connect()}>connect</button>
        )}

        <button onClick={() => this.ledOn()}>on</button>
        <button onClick={() => this.ledOff()}>off</button>

        <div>
          <pre>{response}</pre>
        </div>
      </div>
    );
  }
}

render(<App />, document.querySelector("body"));
