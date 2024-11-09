import { IoMenu, IoSettings } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { RxActivityLog } from "react-icons/rx";
import { chatContext } from "../../context/chatContext";
import { useState, useContext, useEffect } from "react";

const SIdeBar = () => {
  const [tabOpen, setTabOpen] = useState(false);
  const context = useContext(chatContext);
  if (!context) {
    throw new Error("chatContext must be used within a ChatProvider");
  }
  const {
    recentChats,
    sendPrompt,
    recentChat,
    getChatsFromDb,
    setShowResult,
    setRecentChat,
  } = context;
  useEffect(() => {
    getChatsFromDb();
  }, []);
  return (
    <div className="hidden  min-h-screen max-h-screen bg-[#83d088]/10 w-fit p-3 py-5 md:flex flex-col justify-between text-gray-600 transition-all ease-in-out sticky top-0 bottom-0">
      <div className="flex flex-col justify-start items-start gap-5">
        <span
          onClick={() => setTabOpen((prev) => !prev)}
          className="p-3 rounded-full hover:bg-gray-600/10 cursor-pointer"
        >
          <IoMenu size={22} />
        </span>

        <span
          onClick={() => {
            setShowResult(false);
            setRecentChat("");
          }}
          className="flex justify-center items-center text-sm font-medium gap-5 p-3 rounded-full hover:bg-gray-600/10 cursor-pointer"
        >
          <FaPlus size={18} />
          {tabOpen && (
            <span className="font-medium block w-[80px]">New Chat</span>
          )}
        </span>

        {tabOpen && (
          <div>
            <span className="text-base font-semibold flex items-center gap-2">
              Recent
            </span>
            <div className="mt-2 flex flex-col gap-2 w-full">
              {recentChats.map(({ chat }: { chat: string }) => (
                <span
                  onClick={() => sendPrompt(chat)}
                  className={`max-w-[250px] text-sm font-normal flex items-center gap-2 p-2 rounded-full hover:bg-gray-600/10 cursor-pointer ${
                    recentChat === chat ? "bg-gray-600/10" : ""
                  }`}
                >
                  <IoChatboxEllipsesOutline size={20} />
                  <span className="line-clamp-1 font-normal ">{chat}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col justify-end items-start">
        <span className=" w-full text-sm font-normal flex items-center justify-center gap-4 p-3 cursor-pointer rounded-full hover:bg-gray-600/10">
          <IoMdHelpCircleOutline size={18} />
          {tabOpen && <span className="font-semibold w-full">Help</span>}
        </span>
        <span className=" w-full text-sm font-normal flex justify-center items-center gap-4 p-3 cursor-pointer rounded-full hover:bg-gray-600/10">
          <RxActivityLog size={18} />
          {tabOpen && <span className="font-semibold w-full">Activity</span>}
        </span>
        <span className="w-full text-sm font-normal flex items-center justify-center  gap-4 p-3 cursor-pointer rounded-full hover:bg-gray-600/10">
          <IoSettings size={18} />
          {tabOpen && <span className="font-semibold w-full ">Settings</span>}
        </span>
      </div>
    </div>
  );
};

export default SIdeBar;
