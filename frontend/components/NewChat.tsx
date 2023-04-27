import { Transition, Dialog } from "@headlessui/react";
import React, {
  Dispatch,
  FormEventHandler,
  Fragment,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { CloseIcon } from "./Icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import UserOperations from "@/graphql/operations/users";
import ConversationOperations from "@/graphql/operations/conversation";
import { client } from "@/graphql/apollo-client";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";
import Button from "./Button";
import { getSession } from "next-auth/react";

const NewChat = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUserInput
  >(UserOperations.Queries.searchUsers, {
    client: client,
  });
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationOperations.Mutations.createConversation,
      {
        client: client,
      }
    );

  const handleCreateConversation = async () => {
    const session = await getSession();
    const participantIds = [
      //@ts-ignore
      session?.user?.id,
      ...participants.map((p) => p.id),
    ];
    try {
      const {} = await createConversation({
        variables: {
          participantIds,
        },
      });
    } catch (error: any) {
      console.log(error);
      alert(error?.message);
    }
  };

  const handleSearch: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;

    searchUsers({ variables: { email } });
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) =>
      prev.some((p) => p.id === user.id) ? prev : [...prev, user]
    );
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  const handleClose = () => {
    formRef?.current?.reset();
    setIsOpen(false);
  };

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog
        onClose={handleClose}
        className="absolute inset-0 z-[9999] flex items-start justify-center bg-gray-400/5"
      >
        <Dialog.Panel className="bg-white p-6 translate-y-32 relative flex flex-col gap-4 w-full max-w-md shadow-lg rounded-lg overflow-hidden max-h-[calc(100vh-30vh)]">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 hover:bg-gray-100 text-gray-800 w-6 h-6 focus:outline-none flex items-center justify-center rounded-md"
          >
            <CloseIcon />
          </button>
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Start a conversation
          </Dialog.Title>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSearch}
            ref={formRef}
          >
            <input
              className="py-2 px-4 border border-gray-200 focus:outline-none rounded-md text-gray-800"
              placeholder="Email address"
              name="email"
              required
            />
            <Button loading={loading} label="Search" type="submit" />
          </form>

          {data?.searchUsers ? (
            <UserSearchList
              participants={participants}
              users={data?.searchUsers}
              addParticipant={addParticipant}
            />
          ) : null}

          {participants.length !== 0 ? (
            <>
              <Participants
                participants={participants}
                removeParticipant={removeParticipant}
              />
              <Button
                label="Start Conversation"
                type="button"
                loading={createConversationLoading}
                onClick={handleCreateConversation}
              />
            </>
          ) : null}
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};

export default NewChat;
