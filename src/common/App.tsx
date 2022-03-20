import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react'
import { IPublicClientApplication } from '@azure/msal-browser';

import ProvideAppContext from './AppContext';
import ErrorMessage from './ErrorMessage';
import NavBar from './NavBar';
import Welcome from '../Welcome';

import { Stack } from "@fluentui/react";

type AppProps = {
  pca: IPublicClientApplication
};


export default function App({ pca }: AppProps) {
  return (
    <MsalProvider instance={pca}>
      <ProvideAppContext>
        <BrowserRouter>
          <NavBar />
          <Stack horizontalAlign="center" gap={25}>
            <ErrorMessage />
            <Routes>
              <Route path="/" element={<Welcome />} />
            </Routes>
          </Stack>
        </BrowserRouter>
      </ProvideAppContext>
    </MsalProvider>
  );
}
