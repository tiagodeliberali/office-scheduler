import { HashRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import ProvideAppContext from "./AppContext";
import ErrorMessage from "./ErrorMessage";
import Calendar from "../calendar/Calendar";

import { initializeIcons, Stack } from "@fluentui/react";

import { Talkr } from "talkr";
import en from "../i18n/en.json";
import pt from "../i18n/pt.json";

type AppProps = {
  pca: IPublicClientApplication;
};

export default function App({ pca }: AppProps) {
  initializeIcons();

  return (
    <MsalProvider instance={pca}>
      <ProvideAppContext>
        <Talkr languages={{ en, pt }} defaultLanguage="en">
          <HashRouter>
            <Stack horizontalAlign="center" gap={25}>
              <ErrorMessage />
              <Routes>
                <Route path="/" element={<Calendar />} />
              </Routes>
            </Stack>
          </HashRouter>
        </Talkr>
      </ProvideAppContext>
    </MsalProvider>
  );
}
