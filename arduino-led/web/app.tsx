import { h, Component, FunctionComponent, render } from "preact";

import { Serial } from "../../lib/serial";
import { requestDevice } from "../../lib/usb";

let serial: Serial = null;

type State = { response: string; connected: boolean; analog: number };

class App extends Component<any, State> {
  state = {
    response: "",
    connected: false,
    analog: 10,
  } as State;

  async connect() {
    let [d] = await navigator.usb.getDevices();
    if (!d) {
      d = await requestDevice();
    }

    serial = new Serial(d);

    try {
      await serial.connect();
      await this.ledOn();
      
      this.setState({ connected: true, response: "" });
    } catch (err) {
      this.setState({ connected: false, response: `err: ${err.toString()}` });
      return;
    }

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
    await this.ledFade(255);
  }

  async ledOff() {
    await this.ledFade(0);
  }

  async ledFade(analog: number) {
    this.setState({ analog });
    await serial?.write(Uint8Array.from([analog]));
  }

  render() {
    const { connected, response, analog } = this.state;
    return (
      <div>
        {connected ? (
          <button onClick={() => this.disconnect()}>disconnect</button>
        ) : (
          <button onClick={() => this.connect()}>connect</button>
        )}

        {!!connected && (
          <div>
            <button onClick={() => this.ledOff()}>off</button>
            <input
              type="range"
              value={analog}
              onChange={(e) => this.ledFade(+e.target.value)}
              min="0"
              max="255"
              step="5"
            />
            <button onClick={() => this.ledOn()}>on</button>
          </div>
        )}

        <div>
          <pre>{response}</pre>
        </div>
      </div>
    );
  }
}

render(<App />, document.querySelector("body"));
