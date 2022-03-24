import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { useEffect, useState, useReducer } from 'react';
import { useT } from "talkr";
import { Attendee, Contact, NullableOption, ResponseStatus } from 'microsoft-graph';
import { ActionButton, CommandButton, IDocumentCardStyles, Persona, PersonaPresence, PersonaSize, PrimaryButton } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { createContact, getContactList } from './ContactGraphService';
import { useAppContext } from '../common/AppContext';
import ContactCard from './ContactCard';


type ISelectCustomerProps = {
    onSelected: any
}

const hasContacts = (contacts: Contact[] | undefined): boolean => {
    return !!contacts && contacts.length > 0
}

export default function SelectCustomer({ onSelected }: ISelectCustomerProps) {
    const app = useAppContext();
    const { T } = useT();

    const loadContacts = async (name: string, saveContactsToState: any) => {
        if (!name) {
            saveContactsToState([]);
        } else {
            const contacts = await getContactList(app.authProvider!, name);
            saveContactsToState(contacts);
        }
    }

    const selectCustomer = (person: Contact) => {
        setSelectedCustomer(person)
        onSelected(person)
    }

    const [contacts, setContacts] = useState<Contact[]>();
    const [selectedCustomer, setSelectedCustomer] = useState<Contact | undefined>();
    const [createdCustomer, setCreatedCustomer] = useState<Contact | undefined>();

    const createContactAndSelect = async () => {
        if (createdCustomer?.emailAddresses && createdCustomer?.emailAddresses.length > 0) {
            createdCustomer.emailAddresses[0].name = `${createdCustomer?.givenName} ${createdCustomer?.surname}`;
        }

        const newContact = await createContact(app.authProvider!, createdCustomer!)
        setCreatedCustomer(undefined);
        selectCustomer(newContact)
    }

    const cardStyles: IDocumentCardStyles = {
        root: { display: 'inline-block', marginRight: 20, width: 320 },
    };

    const stackButtonItemStyles: IStackItemStyles = {
        root: {
        },
    };

    return (
        <Stack>
            {!selectedCustomer && !createdCustomer && <>
                <TextField label={T("selectcustomer.search")?.toString()} onChange={(_, value) => loadContacts(value || '', setContacts)} />
                <Stack styles={cardStyles}>
                    {contacts?.map(contact => <ContactCard person={contact} onSelected={selectCustomer} />)}
                </Stack>
                <Stack.Item align="end" styles={stackButtonItemStyles}>
                    {!hasContacts(contacts) && <ActionButton
                        iconProps={{ iconName: 'AddFriend' }}
                        onClick={() => setCreatedCustomer({ categories: ["patient"] })}
                        text={T("selectcustomer.create")?.toString()} />}
                </Stack.Item>
            </>}
            {
                !selectedCustomer && createdCustomer && <>
                    <TextField label={T("selectcustomer.firstname")?.toString()} onChange={(_, value) => setCreatedCustomer({ ...createdCustomer, givenName: value })} />
                    <TextField label={T("selectcustomer.lastname")?.toString()} onChange={(_, value) => setCreatedCustomer({ ...createdCustomer, surname: value })} />
                    <TextField label={T("selectcustomer.email")?.toString()} onChange={(_, value) => setCreatedCustomer({ ...createdCustomer, emailAddresses: [{ address: value }] })} />
                    <br /><br />
                    <PrimaryButton text={T("selectcustomer.create")?.toString()} onClick={createContactAndSelect} />
                </>
            }
            {
                selectedCustomer && <>
                    <ContactCard person={selectedCustomer} />
                </>
            }
            {/* <pre><code>{JSON.stringify(contacts, null, 2)}</code></pre> */}
        </Stack >
    );
}

