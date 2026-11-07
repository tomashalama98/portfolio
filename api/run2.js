// Doplňující dva testy (Tomášovy tipy: 404 a 200).
const http = require("http");

let records = [
  { id: 1, jerab: "Liebherr LTM 1050", datum: "2026-09-10", technik: "Novák",   vysledek: "Vyhověl" },
  { id: 2, jerab: "Tatra AD 28",        datum: "2026-10-02", technik: "Svoboda", vysledek: "S výhradami" },
  { id: 3, jerab: "Demag AC 40",        datum: "2026-07-18", technik: "Dvořák",  vysledek: "Nevyhověl" },
];
function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(obj === undefined ? "" : JSON.stringify(obj));
}
const server = http.createServer((req, res) => {
  const m = req.url.match(/^\/revize(?:\/(\d+))?$/);
  if (!m) return send(res, 404, { error: "neznámá adresa" });
  const id = m[1] ? Number(m[1]) : null;
  if (req.method === "GET" && id === null) return send(res, 200, records);
  if (req.method === "GET" && id !== null) {
    const r = records.find((x) => x.id === id);
    return r ? send(res, 200, r) : send(res, 404, { error: "revize nenalezena" });
  }
  if (req.method === "POST" && id === null) {
    let body = "";
    req.on("data", (d) => (body += d));
    req.on("end", () => {
      let data = {};
      try { data = body ? JSON.parse(body) : {}; } catch (e) { return send(res, 400, { error: "neplatný JSON" }); }
      if (!data.jerab || !data.datum || !data.technik)
        return send(res, 400, { error: "chybí povinné pole (jerab, datum, technik)" });
      const novy = { id: Math.max(0, ...records.map((r) => r.id)) + 1, ...data };
      records.push(novy);
      return send(res, 201, novy);
    });
    return;
  }
  if (req.method === "DELETE" && id !== null) {
    const i = records.findIndex((x) => x.id === id);
    if (i === -1) return send(res, 404, { error: "revize nenalezena" });
    records.splice(i, 1);
    return send(res, 204);
  }
  return send(res, 405, { error: "metoda nepodporována" });
});
server.listen(0, async () => {
  const port = server.address().port;
  const call = (method, path, body) =>
    new Promise((resolve) => {
      const data = body ? JSON.stringify(body) : null;
      const r = http.request(
        { host: "127.0.0.1", port, path, method,
          headers: data ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } : {} },
        (resp) => { let b = ""; resp.on("data", (d) => (b += d)); resp.on("end", () => resolve({ status: resp.statusCode, body: b })); }
      );
      if (data) r.write(data);
      r.end();
    });
  const cases = [
    { n: "2e", label: "GET /revize/99  (Tomášův tip: 404)", tip: 404, run: () => call("GET", "/revize/99") },
    { n: "2f", label: "POST /revize  s kompletními údaji (Tomášův tip: 200)", tip: 200,
      run: () => call("POST", "/revize", { jerab: "Grove GMK 3050", datum: "2026-11-20", technik: "Horák", vysledek: "Vyhověl" }) },
  ];
  for (const c of cases) {
    const res = await c.run();
    const shoda = res.status === c.tip ? "tip SEDÍ ✅" : "tip NESEDÍ ⚠️  (ale nemusí to být chyba — viz výklad)";
    console.log(`[${c.n}] ${c.label}`);
    console.log(`     skutečný stav: ${res.status}   (tvůj tip ${c.tip})   → ${shoda}`);
    if (res.body) console.log(`     tělo odpovědi: ${res.body.slice(0, 180)}`);
    console.log("");
  }
  server.close();
});
