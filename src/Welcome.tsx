import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from './common/AppContext';
import { PrimaryButton } from '@fluentui/react/lib/Button';

export default function Welcome() {
    const app = useAppContext();

    return (
        <div className="p-5 mb-4 bg-light rounded-3">
            <div>
                <h1>Office scheduler</h1>
                <p className="lead">
                    An easy way to keep your schedule working for you!
                </p>
                <AuthenticatedTemplate>
                    <div>
                        <h4>Welcome {app.user?.displayName || ''}!</h4>
                        <p>Use the navigation bar at the top of the page to get started.</p>
                    </div>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <PrimaryButton color="primary" onClick={app.signIn!} text="Click here to sign in" />
                </UnauthenticatedTemplate>
            </div>
        </div>
    );
}