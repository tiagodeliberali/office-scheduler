import React, {
  useContext,
  createContext,
  useState,
  MouseEventHandler,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

import config from "./Config";
import { getUser } from "./GraphService";

export interface AppUser {
  displayName?: string;
  email?: string;
  avatar?: string;
  timeZone?: string;
  timeFormat?: string;
}

export interface AppError {
  message: string;
  debug?: string;
}

type AppContext = {
  user?: AppUser;
  error?: AppError;
  signIn?: MouseEventHandler<HTMLElement>;
  signOut?: MouseEventHandler<HTMLElement>;
  displayError?: (message: string, debug?: string) => void;
  clearError?: () => void;
  authProvider?: AuthCodeMSALBrowserAuthenticationProvider;
};

const appContext = createContext<AppContext>({
  user: undefined,
  error: undefined,
  signIn: undefined,
  signOut: undefined,
  displayError: undefined,
  clearError: undefined,
  authProvider: undefined,
});

export function useAppContext(): AppContext {
  return useContext(appContext);
}

interface ProvideAppContextProps {
  children: React.ReactNode;
}

export default function ProvideAppContext({
  children,
}: ProvideAppContextProps) {
  const auth = useProvideAppContext();
  return <appContext.Provider value={auth}>{children}</appContext.Provider>;
}

function useProvideAppContext() {
  const msal = useMsal();

  const [user, setUser] = useState<AppUser | undefined>(undefined);
  const [error, setError] = useState<AppError | undefined>(undefined);

  const authProvider = useMemo(() => {
    return new AuthCodeMSALBrowserAuthenticationProvider(
      msal.instance as PublicClientApplication,
      {
        account: msal.instance.getActiveAccount()!,
        scopes: config.scopes,
        interactionType: InteractionType.Popup,
      }
    );
  }, [msal.instance]);

  const displayError = useCallback((message: string, debug?: string) => {
    setError({ message, debug });
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        try {
          const account = msal.instance.getActiveAccount();
          if (account) {
            const user = await getUser(authProvider);

            setUser({
              displayName: user.displayName || "",
              email: user.mail || user.userPrincipalName || "",
              timeFormat: user.mailboxSettings?.timeFormat || "h:mm a",
              timeZone: user.mailboxSettings?.timeZone || "UTC",
            });
          }
        } catch (err: any) {
          displayError(err.message);
        }
      }
    };
    checkUser();
  }, [authProvider, displayError, msal.instance, user]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  const signIn = useCallback(async () => {
    await msal.instance.loginPopup({
      scopes: config.scopes,
      prompt: "select_account",
    });

    const user = await getUser(authProvider);

    setUser({
      displayName: user.displayName || "",
      email: user.mail || user.userPrincipalName || "",
      timeFormat: user.mailboxSettings?.timeFormat || "",
      timeZone: user.mailboxSettings?.timeZone || "UTC",
    });
  }, [authProvider, msal.instance]);

  const signOut = useCallback(async () => {
    await msal.instance.logoutPopup();
    setUser(undefined);
  }, [msal.instance]);

  return {
    user,
    error,
    signIn,
    signOut,
    displayError,
    clearError,
    authProvider,
  };
}
