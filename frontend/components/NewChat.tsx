import { Transition, Dialog } from "@headlessui/react";
import React, {
  Dispatch,
  FormEventHandler,
  Fragment,
  SetStateAction,
  useRef,
} from "react";
import { ButtonLoader, CloseIcon } from "./Icons";
import { useLazyQuery } from "@apollo/client";
import UserOperations from "@/graphql/operations/users";
import { client } from "@/graphql/apollo-client";
import UserSearchList from "./UserSearchList";

const NewChat = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const formRef = useRef(null);
  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUserInput
  >(UserOperations.Queries.searchUsers, {
    client: client,
  });

  const handleSearch: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;

    searchUsers({ variables: { email } });
  };

  const handleClose = () => {
    //@ts-ignore
    formRef.current.reset();
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
        <Dialog.Panel className="bg-white p-6 translate-y-32 relative flex flex-col gap-4 w-full max-w-sm shadow-lg rounded-lg">
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
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 bg-blue-500 rounded-md text-white font-semibold min-h-[42px] flex items-center justify-center disabled:bg-gray-400"
            >
              {loading ? <ButtonLoader /> : "Search"}
            </button>
          </form>

          {data?.searchUsers ? (
            <UserSearchList users={data?.searchUsers} />
          ) : null}
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};

export default NewChat;
