// Reklamní a trackovací domény, které na cvičném e-shopu překrývají obsah
// (vignette, iframy) a dělají testy nestabilní.
const BLOCKED_HOSTS = [
  "googlesyndication.com",
  "doubleclick.net",
  "adservice.google.com",
  "googleadservices.com",
  "google-analytics.com",
  "googletagmanager.com",
  "pagead2.googlesyndication.com",
  "adsbygoogle",
  "fundingchoicesmessages.google.com",
  "googlefc",
  "adnxs.com",
  "amazon-adsystem.com",
];

const BLOCK_PATTERN = new RegExp(
  BLOCKED_HOSTS.map((h) => h.replace(/\./g, "\\.")).join("|"),
  "i",
);

/** Zablokuje reklamní požadavky pro celý browser context. */
async function blockAds(context) {
  await context.route(BLOCK_PATTERN, (route) => route.abort());
}

module.exports = { blockAds, BLOCKED_HOSTS };
