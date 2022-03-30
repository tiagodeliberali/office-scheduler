import {
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from "@fluentui/react/lib/Stack";
import { useEffect, useState, useReducer } from "react";
import { useT } from "talkr";
import {
  Attendee,
  Contact,
  NullableOption,
  ResponseStatus,
} from "microsoft-graph";
import {
  ActionButton,
  CommandButton,
  IDocumentCardStyles,
  Persona,
  PersonaPresence,
  PersonaSize,
  PrimaryButton,
} from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { createContact, getContactList } from "./ContactGraphService";
import { useAppContext } from "../common/AppContext";
import ContactCard from "./ContactCard";
import SelectableContactCard from "./SelectableContactCard";

type ISelectContactProps = {
  onSelected: any;
};

const hasContacts = (contacts: Contact[] | undefined): boolean => {
  return !!contacts && contacts.length > 0;
};

export default function SelectContact({ onSelected }: ISelectContactProps) {
  const app = useAppContext();
  const { T } = useT();

  const loadContacts = async (name: string, saveContactsToState: any) => {
    if (!name) {
      saveContactsToState([]);
    } else {
      const contacts = await getContactList(app.authProvider!, name);
      saveContactsToState(contacts);
    }
  };

  const selectContact = (person: Contact) => {
    setSelectedContact(person);
    onSelected(person);
  };

  const [contacts, setContacts] = useState<Contact[]>();
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [createdContact, setCreatedContact] = useState<Contact | undefined>();
  const [savingContent, setSavingContent] = useState<boolean>(false);

  const createContactAndSelect = async () => {
    setSavingContent(true);
    if (
      createdContact?.emailAddresses &&
      createdContact?.emailAddresses.length > 0
    ) {
      createdContact.emailAddresses[0].name = `${createdContact?.givenName} ${createdContact?.surname}`;
    }

    const newContact = await createContact(app.authProvider!, createdContact!);
    setCreatedContact(undefined);
    selectContact(newContact);
    setSavingContent(false);
  };

  const cardStyles: IDocumentCardStyles = {
    root: { display: "inline-block", marginRight: 20, width: 320 },
  };

  const stackButtonItemStyles: IStackItemStyles = {
    root: {},
  };

  const buttonValue = savingContent
    ? T("selectContact.saving")?.toString()
    : T("selectContact.create")?.toString();

  return (
    <Stack>
      {!selectedContact && !createdContact && (
        <>
          <TextField
            label={T("selectContact.search")?.toString()}
            onChange={(_, value) => loadContacts(value || "", setContacts)}
          />
          <Stack styles={cardStyles}>
            {contacts?.map((contact) => (
              <SelectableContactCard
                person={contact}
                onSelected={selectContact}
              />
            ))}
          </Stack>
          <Stack.Item align="end" styles={stackButtonItemStyles}>
            {!hasContacts(contacts) && (
              <ActionButton
                iconProps={{ iconName: "AddFriend" }}
                onClick={() => setCreatedContact({ categories: ["patient"] })}
                text={T("selectContact.create")?.toString()}
              />
            )}
          </Stack.Item>
        </>
      )}
      {!selectedContact && createdContact && (
        <>
          <TextField
            label={T("selectContact.firstName")?.toString()}
            onChange={(_, value) =>
              setCreatedContact({ ...createdContact, givenName: value })
            }
          />
          <TextField
            label={T("selectContact.lastName")?.toString()}
            onChange={(_, value) =>
              setCreatedContact({ ...createdContact, surname: value })
            }
          />
          <TextField
            label={T("selectContact.email")?.toString()}
            onChange={(_, value) =>
              setCreatedContact({
                ...createdContact,
                emailAddresses: [{ address: value }],
              })
            }
          />
          <br />
          <br />
          <PrimaryButton
            text={buttonValue}
            disabled={savingContent}
            onClick={createContactAndSelect}
          />
        </>
      )}
      {selectedContact && (
        <>
          <ContactCard contact={selectedContact} />
        </>
      )}
      {/* <pre><code>{JSON.stringify(contacts, null, 2)}</code></pre> */}
    </Stack>
  );
}
