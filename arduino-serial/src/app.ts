import "xterm/css/xterm.css";

import { Terminal } from "xterm";

const t = new Terminal({});

t.open(document.querySelector("body"));

//t.write("test");

t.onData((e) => {
  switch (e) {
    case "\r": // Enter
    case "\u0003": // Ctrl+C
      prompt(t);
      break;
    case "\u007F": // Backspace (DEL)
      // Do not delete the prompt
      if ((t as any)._core.buffer.x > 2) {
        t.write("\b \b");
      }
      break;
    default:
      // Print all other characters for demo
      t.write(e);
  }
});

prompt(t);

function prompt(term: Terminal) {
  term.write("\r\n> ");
}

console.log("Terminal", t);
console.log("serial");
