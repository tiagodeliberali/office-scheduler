import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { useT } from "talkr";
import { Contact, EmailAddress, ResponseStatus } from 'microsoft-graph';
import { Persona, PersonaSize } from '@fluentui/react';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardTitle,
    DocumentCardLogo,
    DocumentCardStatus,
    IDocumentCardLogoProps,
    IDocumentCardActivityPerson,
    IDocumentCardStyles,
} from '@fluentui/react/lib/DocumentCard';

type IContactCardProps = {
    person: Contact | undefined,
    onSelected: any
}

export default function ContactCard({ person, onSelected }: IContactCardProps) {
    const { T } = useT();

    const iconClass = mergeStyles({
        fontSize: 30,
        margin: '0 25px',
    });

    const classNames = mergeStyleSets({
        deepSkyBlue: [{ color: 'deepskyblue' }, iconClass],
    });

    const logoProps: IDocumentCardLogoProps = {
        logoIcon: 'contact',
        className: classNames.deepSkyBlue
    };

    const cardStyles: IDocumentCardStyles = {
        root: { display: 'inline-block', marginRight: 20, width: 320 },
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
                            <DocumentCardTitle title={person?.givenName || T("contactcard.notfilled")?.toString()!} />
                        </Stack.Item><Stack.Item styles={stacSubkHeaderItemStyles}>
                            {person?.surname}
                        </Stack.Item>
                    </Stack>
                    <DocumentCardLogo {...logoProps} />
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
