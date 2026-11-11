const { expect } = require("@playwright/test");

/** Vytvoří účet přes API webu (rychlejší a stabilnější než přes formulář). */
async function createAccountViaApi(request, user) {
  const response = await request.post("/api/createAccount", {
    form: {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.birthDay,
      birth_month: user.birthMonth,
      birth_year: user.birthYear,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company,
      address1: user.address,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobile,
    },
  });
  const body = JSON.parse(await response.text());
  expect(body.responseCode, `createAccount: ${body.message}`).toBe(201);
}

/** Smaže účet přes API. Idempotentní – chybu "neexistuje" ignoruje. */
async function deleteAccountViaApi(request, user) {
  await request.delete("/api/deleteAccount", {
    form: { email: user.email, password: user.password },
  });
}

module.exports = { createAccountViaApi, deleteAccountViaApi };
