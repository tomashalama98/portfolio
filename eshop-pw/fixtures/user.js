let counter = 0;

/**
 * Vygeneruje unikátního uživatele. Unikátnost zajišťuje časové razítko,
 * PID procesu a čítač (testy běží paralelně).
 */
function buildUser(prefix = "tester") {
  counter += 1;
  const stamp = `${Date.now()}${process.pid}${counter}`;
  return {
    name: `Tester ${stamp}`,
    email: `${prefix}.${stamp}@example.com`,
    password: "Heslo123!",
    title: "Mr",
    birthDay: "5",
    birthMonth: "5",
    birthMonthName: "May",
    birthYear: "2000",
    firstName: "Jan",
    lastName: "Novák",
    company: "Testovací s.r.o.",
    address: "Husova 12",
    address2: "",
    country: "India",
    state: "Středočeský",
    city: "Beroun",
    zipcode: "26601",
    mobile: "123456789",
  };
}

/** Testovací platební karta (web platbu neověřuje). */
const TEST_CARD = {
  name: "Jan Novák",
  number: "4111111111111111",
  cvc: "311",
  expiryMonth: "12",
  expiryYear: "2030",
};

module.exports = { buildUser, TEST_CARD };
