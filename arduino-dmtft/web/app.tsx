import { h, Component, FunctionComponent, render } from "preact";

import { Serial } from "../../lib/serial";
import { requestDevice } from "../../lib/usb";

let serial: Serial = null;

type State = { response: string; connected: boolean; analog: number };

class App extends Component<any, State> {
  render() {
    return <div>todo</div>;
  }
}

render(<App />, document.querySelector("body"));
