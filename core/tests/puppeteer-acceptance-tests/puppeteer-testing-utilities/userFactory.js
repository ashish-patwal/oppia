// Copyright 2023 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utility File for declaring and initializing users.
 */

const superAdminUtilsUser = require("./superAdminUtils");
const blogPostAdminUtilsUser = require("./blogPostAdminUtils");

let superAdminInstance = blogAdminInstance = blogPostEditorInstance = null;
let browserInstances = [];

const ROLE_BLOG_ADMIN = "blog admin";
const ROLE_BLOG_POST_EDITOR = "blog post editor";

let createNewSuperAdmin = async function (username) {
  if (superAdminInstance !== null) {
    return superAdminInstance;
  }

  const superAdmin = new superAdminUtilsUser();
  await superAdmin.openBrowser();

  browserInstances.push(superAdmin);
  return (superAdminInstance = superAdmin);
};

let createNewBlogAdmin = async function (username) {
  if (blogAdminInstance !== null) {
    return blogAdminInstance;
  }

  if (superAdminInstance === null) {
    superAdminInstance = await createNewSuperAdmin("superAdm");
  }

  const blogAdmin = new blogPostAdminUtilsUser();
  await blogAdmin.openBrowser();
  await blogAdmin.signUpNewUser(username, "blog_admin@example.com");

  await superAdminInstance.assignRoleToUser(username, ROLE_BLOG_ADMIN);
  await superAdminInstance.expectUserToHaveRole(username, ROLE_BLOG_ADMIN);

  browserInstances.push(blogAdmin);
  return (blogAdminInstance = blogAdmin);
};

let createNewBlogPostEditor = async function (username) {
  if (blogPostEditorInstance !== null) {
    return blogPostEditorInstance;
  }

  if (blogAdminInstance === null) {
    blogAdminInstance = await createNewBlogAdmin("blogAdm");
  }

  const blogPostEditor = new blogPostAdminUtilsUser();
  await blogPostEditor.openBrowser();
  await blogPostEditor.signUpNewUser(username, "blog_post_editor@example.com");

  await blogAdminInstance.assignUserToRoleFromBlogAdminPage(
    "blogPostEditor",
    "BLOG_POST_EDITOR"
  );
  await superAdminInstance.expectUserToHaveRole(
    "blogPostEditor",
    ROLE_BLOG_POST_EDITOR
  );

  browserInstances.push(blogPostEditor);
  return (blogPostEditorInstance = blogPostEditor);
};

let createNewGuestUser = async function (username, email) {
  const guestUser = new blogPostAdminUtilsUser();
  await guestUser.openBrowser();
  await guestUser.signUpNewUser(username, email);

  browserInstances.push(guestUser);
  return guestUser;
};

let closeAllBrowsers = async function () {
  for (let i = 0; i < browserInstances.length; i++) {
    await browserInstances[i].closeBrowser();
  }
};

module.exports = {
  createNewSuperAdmin,
  createNewBlogAdmin,
  createNewBlogPostEditor,
  createNewGuestUser,
  closeAllBrowsers,
};
