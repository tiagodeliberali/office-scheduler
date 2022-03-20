import { useAppContext } from './AppContext';
import {
    MessageBar,
    MessageBarType,
} from '@fluentui/react';


export default function ErrorMessage() {
    const app = useAppContext();

    if (app.error) {
        return (
            <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
                // onDismiss={p.resetChoice}
                dismissButtonAriaLabel="Close"
            >
                <p className="mb-3">{app.error.message}</p>
                {app.error.debug ?
                    <pre className="alert-pre border bg-light p-2"><code>{app.error.debug}</code></pre>
                    : null
                }
            </MessageBar>
        );
    }

    return null;
}