import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  Modal,
  Stack,
  Icon,
  Toggle,
} from "@fluentui/react";
import { IconButton, IButtonStyles } from "@fluentui/react/lib/Button";
import { ISlot } from "../slot/BaseSlot";
import { format } from "date-fns/esm";
import { useT } from "talkr";
import SelectContact from "../contact/SelectContact";
import { PrimaryButton } from "@fluentui/react/lib/Button";

import { useState } from "react";
import { Contact, Event } from "microsoft-graph";
import { createEvent } from "./CalendarGraphService";
import { useAppContext } from "../common/AppContext";

type INewEventProps = {
  isOpen: boolean;
  hideModal: any;
  slot?: ISlot;
};

const theme = getTheme();

const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
  header: [
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      alignItems: "top",
      fontWeight: FontWeights.semibold,
      padding: "0px 12px 14px 24px",
    },
  ],
  title: [
    theme.fonts.xxLarge,
    {
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "12px 0px 0px 0px",
    },
  ],
  subheader: [
    theme.fonts.large,
    {
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "6px 12px 0px 0px",
    },
  ],
  body: {
    flex: "4 4 auto",
    padding: "0 24px 24px 24px",
    overflowY: "hidden",
    selectors: {
      p: { margin: "14px 0" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
    },
  },
});

export default function NewEvent({ isOpen, hideModal, slot }: INewEventProps) {
  const app = useAppContext();
  const { T, setLocale } = useT();
  app.user && setLocale(app.user.locale);

  const defaultSendInviteState = true;

  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [savingContent, setSavingContent] = useState<boolean>(false);
  const [sendInvite, setSendInvite] = useState<boolean>(defaultSendInviteState);

  const closeModal = () => {
    hideModal();
    setSendInvite(defaultSendInviteState);
    setSelectedContact(undefined);
  };

  const createSchedule = async (contact: Contact) => {
    setSavingContent(true);

    const email =
      contact?.emailAddresses &&
      contact?.emailAddresses.length > 0 &&
      contact?.emailAddresses[0];
    const payload: Event = {
      start: {
        dateTime: slot?.startDate.toISOString(),
        timeZone: app.user?.timeZone,
      },
      end: {
        dateTime: slot?.endDate.toISOString(),
        timeZone: app.user?.timeZone,
      },
      subject: T("newEvent.eventSubject", {
        name: app.user?.displayName,
      })?.toString(),
    };

    if (email && sendInvite) {
      payload.attendees = [
        {
          type: "required",
          emailAddress: {
            address: email.address,
            name: email.name,
          },
        },
      ];
    }
    const event = await createEvent(app.authProvider!, payload, contact);
    slot!.event = event;
    closeModal();
    setSavingContent(false);
  };

  const buttonValue = savingContent
    ? T("newEvent.saving")?.toString()
    : T("newEvent.schedule")?.toString();

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={closeModal}
      isBlocking={false}
      containerClassName={contentStyles.container}
    >
      <Stack>
        <div className={contentStyles.header}>
          <div>
            <div className={contentStyles.title}>
              <Icon styles={iconButtonStyles} iconName="calendar" />{" "}
              <span>{slot && format(slot.startDate, "dd/MM")}</span>
            </div>
            <div className={contentStyles.subheader}>
              <Icon styles={iconButtonStyles} iconName="clock" />{" "}
              <span>{slot && format(slot.startDate, "HH:mm")}</span> -{" "}
              <span>{slot && format(slot.endDate, "HH:mm")}</span>
            </div>
          </div>
          <IconButton
            styles={iconButtonStyles}
            iconProps={{ iconName: "Cancel" }}
            ariaLabel={T("newEvent.close")?.toString()}
            onClick={closeModal}
          />
        </div>

        <div className={contentStyles.body}>
          <SelectContact
            onSelected={(contact: Contact) => setSelectedContact(contact)}
          />
        </div>

        <Stack.Item align="start" styles={{ root: { margin: 16 } }}>
          {selectedContact && (
            <>
              <Toggle
                label={T("newEvent.sendInvite")?.toString()}
                style={{ marginBottom: 16 }}
                checked={sendInvite}
                onText={T("newEvent.sendInviteOn")?.toString()}
                offText={T("newEvent.sendInviteOff")?.toString()}
                onChange={(_, value) => setSendInvite(value || false)}
              />
              <PrimaryButton
                text={buttonValue}
                disabled={savingContent}
                onClick={() => createSchedule(selectedContact)}
              />
            </>
          )}
        </Stack.Item>
      </Stack>
    </Modal>
  );
}
