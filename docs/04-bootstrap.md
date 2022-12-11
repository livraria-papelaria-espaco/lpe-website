# Bootstraping

The app does not do any kind of setup when it is turned on for the first time (yet!).
Therefore, the frontend won't be able to get any data from the backend.

This requires the following actions to be performed on the first run.

## Setting Up Permissions

Permissions need to be setup to allow access to certain endpoints.

Go to **Settings -> Users & Permissions Plugin -> Roles**.

For the **Public** role, add the following permissions for each section:

- Application plugin
  - Category: `count`, `find`, `findone`
  - Global-Discounts: `find`
  - Home-Page: `find`
  - IPN: `eupago`
  - Newsroom: `find`
  - Privacy-Policy: `find`
  - Product: `count`, `findone`, `findoneslug`, `searchenhanced`
  - Product-Highlights: `find`, `findone`
  - Store-Config: `find`
  - Terms-Of-Service: `find`
- Users-Permissions plugin
  - Auth: `callback`, `connect`, `emailconfirmation`, `forgotpassword`, `register`,
    `resetpassword`
  - User: `me`

For the **Authenticated** role, add the following permissions for each section:

- Application plugin
  - Category: `count`, `find`, `findone`
  - Global-Discounts: `find`
  - Home-Page: `find`
  - Newsroom: `find`
  - Order: `calculateshipping`, `count`, `create`, `findone`, `findown`
  - Privacy-Policy: `find`
  - Product: `count`, `findone`, `findoneslug`, `searchenhanced`
  - Product-Highlights: `find`, `findone`
  - Store-Config: `find`
  - Terms-Of-Service: `find`
- Users-Permissions plugin
  - Auth: `connect`
  - User: `me`

## Instanciating Single-Types

Single-Types are empty by default, which means they return `null` and/or `undefined`
on some situations.

This can be avoided by saving each Single Type at least once, even with default
values.

## Other

A category named `Livraria` must be created, otherwise book imported from POS
system will not have a category.

## Setting up Meilisearch

An `products` index must be created.

// TODO
