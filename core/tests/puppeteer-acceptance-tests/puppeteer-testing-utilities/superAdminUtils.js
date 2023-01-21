const puppeteerUtilities = require("./puppeteerUtils.js");

module.exports = class superAdmin extends puppeteerUtilities {
  /**
   * @param {string} username - The username to which role would be assigned.
   */
  async openBrowser(username) {
    await super.openBrowser();
    await this.signUpNewUser(username, "testadmin@example.com");
  }

  /**
   *
   * @param {string} username - The username to which role would be assigned.
   * @param {string role - The role that would be assigned to the user.
   */
  async assignRoleToUser(username, role) {
    await this.goto(rolesEditorTab);
    await this.type(roleEditorInputField, username);
    await this.clickOn("button", roleEditorButtonSelector);
    await this.clickOn("Add role");
    await this.clickOn("div", rolesSelectDropdown);
    await this.page.evaluate(async (role) => {
      const allRoles = document.getElementsByClassName("mat-option-text");
      for (let i = 0; i < allRoles.length; i++) {
        if (allRoles[i].innerText.toLowerCase() === role) {
          allRoles[i].click({ waitUntil: "networkidle0" });
          return;
        }
      }
    }, role);
  }

  /**
   *
   * @param {string} username - The username to which role must be assigned.
   * @param {string} role - The role which must be assigned to the user.
   */
  async expectUserToHaveRole(username, role) {
    const currPageUrl = this.page.url();
    await this.goto(rolesEditorTab);
    await this.type(roleEditorInputField, username);
    await this.clickOn("button", roleEditorButtonSelector);
    await this.page.waitForSelector("div.justify-content-between");
    await this.page.evaluate((role) => {
      const userRoles = document.getElementsByClassName(
        "oppia-user-role-description"
      );
      for (let i = 0; i < userRoles.length; i++) {
        if (userRoles[i].innerText.toLowerCase() === role) {
          return;
        }
      }
      throw new Error("User does not have " + role + " role!");
    }, role);
    showMessage("User " + username + " has the " + role + " role!");
    await this.goto(currPageUrl);
  }

  /**
   *
   * @param {string} username - The user to which the role must not be assigned.
   * @param {string} role - The role which must not be assigned to the user.
   */
  async expectUserNotToHaveRole(username, role) {
    const currPageUrl = this.page.url();
    await this.goto(rolesEditorTab);
    await this.type(roleEditorInputField, username);
    await this.clickOn("button", roleEditorButtonSelector);
    await this.page.waitForSelector("div.justify-content-between");
    await this.page.evaluate((role) => {
      const userRoles = document.getElementsByClassName(
        "oppia-user-role-description"
      );
      for (let i = 0; i < userRoles.length; i++) {
        if (userRoles[i].innerText.toLowerCase() === role) {
          throw new Error("User have the " + role + " role!");
        }
      }
    }, role);
    showMessage("User " + username + " doesnot have the " + role + " role!");
    await this.goto(currPageUrl);
  }
};
