import { Stack, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { useT } from "talkr";
import { Contact } from 'microsoft-graph';
import { Persona, PersonaSize } from '@fluentui/react';

import {
    DocumentCard,
    DocumentCardTitle,
    IDocumentCardStyles,
} from '@fluentui/react/lib/DocumentCard';

type ISelectableContactCardProps = {
    person: Contact | undefined,
    onSelected?: any
}

export default function SelectableContactCard({ person, onSelected }: ISelectableContactCardProps) {
    const { T } = useT();

    const cardStyles: IDocumentCardStyles = {
        root: {},
    };

    const stackHeaderItemStyles: IStackItemStyles = {
        root: {
            paddingTop: 16,
            paddingRight: 108,
            height: 30
        },
    };

    const stackItemStyles: IStackItemStyles = {
        root: {
            padding: 16
        },
    };

    const stacSubkHeaderItemStyles: IStackItemStyles = {
        root: {
            paddingLeft: 16
        },
    };

    return (
        <DocumentCard styles={cardStyles} onClick={() => onSelected(person)}>
            <Stack>
                <Stack horizontal>
                    <Stack>
                        <Stack.Item align="center" styles={stackHeaderItemStyles}>
                            <DocumentCardTitle title={person?.givenName || T("contactCard.notFilled")?.toString()!} />
                        </Stack.Item><Stack.Item styles={stacSubkHeaderItemStyles}>
                            {person?.surname}
                        </Stack.Item>
                    </Stack>
                </Stack>


                <Stack.Item styles={stackItemStyles}>
                    {person?.emailAddresses && person?.emailAddresses.map(email => <Persona
                        text={email.name || ''}
                        secondaryText={email.address || ''}
                        size={PersonaSize.size40} />)}
                </Stack.Item>
            </Stack>
        </DocumentCard>
    );
}
