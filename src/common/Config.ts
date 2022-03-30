const prodConfig = {
  appId: "373a3859-a70c-4cd7-ab2d-972debc12e6a",
  redirectUri: "https://polite-sand-0725aee10.1.azurestaticapps.net",
  scopes: [
    "user.read",
    "mailboxsettings.read",
    "calendars.readwrite",
    "contacts.readwrite",
    "notes.readwrite",
    "mail.read",
  ],
};

const devConfig = {
  appId: "373a3859-a70c-4cd7-ab2d-972debc12e6a",
  redirectUri: "http://localhost:3000",
  scopes: [
    "user.read",
    "mailboxsettings.read",
    "calendars.readwrite",
    "contacts.readwrite",
    "notes.readwrite",
    "mail.read",
  ],
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

export default config;
