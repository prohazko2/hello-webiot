const fs = require("fs").promises;
const http = require("http");

const path = require("path");
const base = path.resolve(__dirname, "build");

const webpack = require("webpack");
const config = require("./webpack.config");

console.log(config.entry);

const compiler = webpack(config);

function log(source = "", ...rest) {
  source = (source || "?").slice(0, 10);
  console.log(new Date().toISOString(), `[${source}]`.padEnd(12), ...rest);
}

const watching = compiler.watch({}, (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  log("watcher", `code updated with hash: ${stats.hash}`);
});

function resolveSafe(base, target) {
  const targetPath = "." + path.posix.normalize("/" + target);
  return path.posix.resolve(base, targetPath);
}

function renderLinks(html) {
  const links = `
  <nav>
    <ul>
    ${Object.keys(config.entry)
      .map((k) => `<li><a href="/${k}.html">${k}</a></li>`)
      .join("\n")}
    </ul>
  </nav>
  `;
  html = html.replace("<!-- demo-links -->", links);
  return html;
}

http
  .createServer(async (req, res) => {
    let file = resolveSafe(base, req.url);
    if (req.url === "/") {
      file = path.resolve(__dirname, "web/index.html");
    }

    try {
      let data = (await fs.readFile(file)).toString();
      data = renderLinks(data);

      log("http ok", req.url);

      res.writeHead(200);
      res.end(data);
    } catch (err) {
      log("http err", req.url, err.toString());

      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
  })
  .listen(9080);
