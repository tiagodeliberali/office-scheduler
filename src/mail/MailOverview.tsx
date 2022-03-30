import { useEffect, useState } from "react";
import { useAppContext } from "../common/AppContext";
import { parseISO } from "date-fns/esm";
import { useT } from "talkr";
import { Contact } from "microsoft-graph";
import { getLastContactMails } from "./MailGraphService";
import { ActionButton, Stack } from "@fluentui/react";

type IMailOverviewProps = {
  contact: Contact | undefined;
};

type IMessage = {
  subject: string;
  hasAttachment: boolean;
  date: Date;
};

const displayText = (value: string): string => {
  const size = 40;
  if (value.length > size) {
    return `${value.substring(0, size)}...`;
  }

  return value;
};

export default function MailOverview({ contact }: IMailOverviewProps) {
  const app = useAppContext();
  const { T } = useT();

  const [mails, setMails] = useState<IMessage[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const messages = await getLastContactMails(
        app.authProvider!,
        contact!,
        10
      );

      setMails(
        messages.map((message) => {
          return {
            subject:
              message.subject ||
              T("mailOverview.noSubject")?.toString() ||
              "<not defined>",
            hasAttachment:
              (message.attachments && message.attachments.length > 0) || false,
            date: parseISO(message.receivedDateTime!),
          };
        })
      );
    };

    loadSessions();
  }, [contact, T, app.authProvider]);

  return (
    <>
      {mails.length === 0 && (
        <ActionButton
          text={T("mailOverview.noEmails")?.toString() || "<not defined>"}
          iconProps={{ iconName: "accept" }}
        />
      )}
      {mails.length > 0 && (
        <Stack>
          {mails.slice(0, 3).map((x) => (
            <ActionButton
              text={displayText(x.subject)}
              iconProps={{ iconName: "mail" }}
            />
          ))}
          {mails.length > 3 && (
            <ActionButton
              text={T("mailOverview.count", {
                qtd: (mails || [])?.length - 3,
              })?.toString()}
            />
          )}
        </Stack>
      )}
    </>
  );
}
