import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from './common/AppContext';
import { PrimaryButton } from '@fluentui/react/lib/Button';

import { useT } from "talkr";

export default function Welcome() {
    const app = useAppContext();
    const { T } = useT();

    return (
        <div className="p-5 mb-4 bg-light rounded-3">
            <div>
                <h1>Office scheduler</h1>
                <p className="lead">
                    {T("welcome.overview")}
                </p>
                <AuthenticatedTemplate>
                    <div>
                        <h4>{T("welcome.title", { name: app.user?.displayName || '' })}</h4>
                        <p>{T("welcome.description")}</p>
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <PrimaryButton color="primary" onClick={app.signIn!} text={T("welcome.signin")?.toString()} />
                </UnauthenticatedTemplate>
            </div>
        </div>
    );
}