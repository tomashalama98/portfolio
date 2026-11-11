const { test, expect } = require("../fixtures");

test.describe("Registrace a přihlášení", () => {
  // TC-E01: Registrace nového uživatele přes formulář a následné smazání účtu.
  test("TC-E01 registrace nového uživatele a smazání účtu @smoke", async ({
    loginPage,
    signupPage,
    newUser,
  }) => {
    await loginPage.open();
    await loginPage.startSignup(newUser.name, newUser.email);
    await signupPage.fillAndSubmit(newUser);

    await expect(signupPage.accountCreated).toBeVisible();
    await signupPage.continueButton.click();
    await signupPage.expectLoggedInAs(newUser.name);

    await signupPage.deleteAccount();
  });

  // TC-E02: Přihlášení existujícího uživatele a odhlášení.
  test("TC-E02 přihlášení existujícího uživatele a odhlášení @smoke", async ({
    loginPage,
    registeredUser,
  }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await loginPage.expectLoggedInAs(registeredUser.name);

    await loginPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loggedInAs).toHaveCount(0);
  });

  // TC-E03: Přihlášení se špatným heslem zobrazí chybu a uživatele nepřihlásí.
  test("TC-E03 přihlášení se špatným heslem je odmítnuto @regression", async ({
    loginPage,
    registeredUser,
  }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, "SpatneHeslo999");

    await expect(loginPage.loginError).toBeVisible();
    await expect(loginPage.loggedInAs).toHaveCount(0);
  });

  // TC-E04: Registrace s e-mailem, který už existuje, je odmítnuta.
  test("TC-E04 registrace už existujícího e-mailu je odmítnuta @regression", async ({
    loginPage,
    registeredUser,
  }) => {
    await loginPage.open();
    await loginPage.startSignup("Jiný Uživatel", registeredUser.email);

    await expect(loginPage.signupError).toBeVisible();
    await expect(loginPage.page).toHaveURL(/\/signup|\/login/);
  });
});
