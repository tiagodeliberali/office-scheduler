import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';

import { useT } from "talkr";
import { Attendee } from 'microsoft-graph';

type IDocumentOverviewProps = {
    person: Attendee | undefined | null
}

export default function DocumentOverview({ person }: IDocumentOverviewProps) {
    const { T } = useT();

    const stackItemStyles: IStackItemStyles = {
        root: {
            paddingTop: 16,
            paddingRight: 108,
        },
    };

    return (
        <Stack>
            Sessão 3
        </Stack>
    );
}