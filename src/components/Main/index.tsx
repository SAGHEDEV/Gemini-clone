import geminiLogo from "../../assets/gemini.png";
import geminiIcon from "../../assets/gemini-icon.png";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoSendSharp } from "react-icons/io5";
import { AiFillAudio } from "react-icons/ai";
import { useContext, useEffect } from "react";
import { chatContext } from "../../context/chatContext";
import { FaStopCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase-config/firebase";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Popover } from "antd";
import { signOut } from "firebase/auth";

// interface TypingEffectProps {
//   text: string; // Must be a string
//   lineDelay?: number;
//   charDelay?: number;
// }

// const TypingEffect: React.FC<TypingEffectProps> = ({
//   text,
//   lineDelay = 1000,
//   charDelay = 0.2,
// }) => {
//   const [displayedText, setDisplayedText] = useState<string>(""); // Displayed text as a string
//   const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
//   const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
//   const lines: string[] = text.split("\n");

//   useEffect(() => {
//     // Function to move to the next line and reset character index
//     const moveToNextLine = () => {
//       setDisplayedText((prev) => prev + "\n"); // Adds a new line in displayed text
//       setCurrentLineIndex((prev) => prev + 1); // Move to the next line
//       setCurrentCharIndex(0); // Reset character index for the new line
//     };

//     if (currentLineIndex < lines.length) {
//       const currentLine = lines[currentLineIndex];

//       // Check if the current line is empty, if so, move to the next line
//       if (currentLine.trim() === "") {
//         moveToNextLine();
//       } else if (currentCharIndex < currentLine.length) {
//         // Typing effect for characters
//         const charTimeout = setTimeout(() => {
//           setDisplayedText((prev) => prev + currentLine[currentCharIndex]);
//           setCurrentCharIndex((prev) => prev + 1);
//         }, charDelay);

//         return () => clearTimeout(charTimeout);
//       } else {
//         // Move to the next line after a delay when the end of a line is reached
//         const lineTimeout = setTimeout(() => {
//           moveToNextLine();
//         }, lineDelay);

//         return () => clearTimeout(lineTimeout);
//       }
//     }
//   }, [currentLineIndex, currentCharIndex, lines, charDelay, lineDelay]);

//   useEffect(() => {

//   }, []);

//   return (
//     <span>
//       <Markdown>{displayedText}</Markdown>
//     </span>
//   );
// };

const PopContent = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };
  return (
    <div className="bg-white p-7 w-full min-w-[200px] md:w-[400px] rounded-md !mr-5 flex flex-col justify-center items-center gap-4">
      <img
        src={user?.photoURL as string}
        alt="User"
        width={80}
        height={80}
        className="rounded-full cursor-pointer shadow-sm"
      />
      <p className="text-2xl font-semibold">Hi , {user?.displayName}</p>
      <p className="font-semibold text-base">{user?.email}</p>
      <div className="w-full flex justify-center items-center">
        <button
          onClick={handleSignOut}
          className="w-full  rounded-full h-[50px] border bg-blue-400 text-base font-bold text-white hover:bg-blue-500 active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const MainPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const context = useContext(chatContext);
  if (!context) {
    throw new Error("chatContext must be used within a ChatProvider");
  }
  const {
    input,
    setInput,
    recentChat,
    showResult,
    loading,
    resultData,
    sendPrompt,
    error,
  } = context;

  const questionList = [
    "How can I access my documents in firebase?",
    "What is DOM and how does it work in javascript and other languages?",
    "Is next really going to overshadow react due to it's feature?",
  ];

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [resultData]);

  if (!user) {
    navigate("/");
  }

  return (
    <main className="w-full  relative text-gray-700 h-screen max-h-screen scroll-smooth">
      <div className="w-full flex justify-between  items-center sticky top-3 p-3 px-5 z-20 bg-white/60 backdrop-blur-lg">
        <img
          src={geminiLogo}
          alt="
        Gemini"
          width={80}
          height={50}
          className="cursor-pointer"
        />
        {user ? (
          <Popover
            content={PopContent}
            trigger={"click"}
            className="rounded-3xl"
          >
            <img
              src={user?.photoURL as string}
              alt="User"
              width={40}
              className="rounded-full cursor-pointer"
            />
          </Popover>
        ) : (
          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex justify-center items-center font-medium">
            U
          </div>
        )}
      </div>
      {!showResult ? (
        <div className="w-full h-[500px] max-h-[500px] md:max-h-[700px] flex flex-col justify-center items-center p-5 overflow-hidden">
          <motion.h2
            initial={{ opacity: 0, bottom: -200 }}
            animate={{ opacity: 1, bottom: 0 }}
            transition={{ bounce: 1, duration: 0.8 }}
            className="text-5xl md:text-[60px] relative font-bold bg-gradient-to-r  from-red-500 text-center via-purple-400 to-blue-500 bg-clip-text text-transparent"
          >
            Hello Developers and Students
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, bottom: -300 }}
            animate={{ opacity: 1, bottom: 0 }}
            transition={{ bounce: 1, duration: 1, delay: 1 }}
            className="font-medium mt-2 text-center relative"
          >
            What do you need assistant with?
          </motion.p>
          <div className="mt-20 flex justify-start items-center gap-10 ">
            {questionList.map((ques) => (
              <div
                key={ques}
                onClick={() => sendPrompt(ques)}
                className="w-44 h-36 p-5 rounded-2xl relative border-2 border-gray-300/60 bg-gray-100/40 backdrop-blur-lg cursor-pointer hover:scale-105"
              >
                <p className="text-sm font-medium">{ques}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col justify-start py-10 px-8 md:px-12 w-full max-w-[1400px] h-[75%] justify-self-center md:h-[70%] max-h-[700px] overflow-y-auto  no-scroll"
          ref={contentRef}
        >
          <div className=" flex justify-end items-start gap-4">
            <p className="p-4 max-w-[800px] bg-gray-200/20 rounded-3xl rounded-tr-none font-semibold">
              {recentChat}
            </p>
            {user ? (
              <img
                src={user?.photoURL as string}
                alt="User"
                width={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex justify-center items-center font-medium">
                U
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row justify-items-stretch items-start gap-4 mt-8">
            {loading ? (
              <div className="flex justify-start items-start gap-3">
                <img
                  src={geminiIcon}
                  alt="gemini loading"
                  width={40}
                  className="animate-spin"
                />
                <div className="w-full flex flex-col gap-3 opacity-65">
                  <div className="w-[250px] lg:w-[800px] rounded-lg p-5 bg-gradient-to-r  from-red-500 text-center via-purple-400 to-blue-500 animate-pulse"></div>
                  <div className="w-[250px] lg:w-[800px] rounded-lg p-5 bg-gradient-to-r  from-red-500 text-center via-purple-400 to-blue-500 animate-pulse"></div>
                  <div className="w-[250px] lg:w-[800px] rounded-lg p-5 bg-gradient-to-r  from-red-500 text-center via-purple-400 to-blue-500 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <img
                src={geminiIcon}
                alt="gemini loading"
                width={35}
                className="sticky md:static "
              />
            )}
            {!error ? (
              <p className="px-2 md:px-4 w-full max-w-[300px] md:max-w-[700px] lg:max-w-[1000px] bg-gray-200/5 rounded-3xl rounded-tl-none leading-[35px] md:leading-[50px]">
                <Markdown>{resultData}</Markdown>
              </p>
            ) : (
              <div>
                <p className="font-semibold">
                  An <span className="text-red-700">error</span> occurred while
                  trying to generate your response. Kindly check your internet
                  connection and try again!
                </p>
                <button
                  onClick={() => sendPrompt(recentChat)}
                  className=" h-[50px] rounded-full border-none bg-gradient-to-r hover:bg-gradient-to-tl  from-red-500 text-center via-purple-400 to-blue-500 px-8 font-bold text-white mt-3 transition ease-out duration-1000"
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="absolute bottom-3 w-full  gap-3 p-2 md:px-6">
        <div className="w-[95%] md:w-[80%] lg:w-[70%] bg-[#83d088]/20 rounded-full h-[50px] md:h-[64px] flex justify-self-center justify-between items-center p-4 gap-5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Ask Gemini"
            className="w-full !m-0 resize-none h-full bg-transparent active:!outline-none active:!border-none focus:!outline-none focus:!border-none px-3"
          />
          <div className="flex justify-center items-center">
            <span className="p-2 cursor-pointer rounded-full hover:bg-gray-600/10">
              <BiSolidImageAdd size={24} />
            </span>
            <span className="p-2 cursor-pointer rounded-full hover:bg-gray-600/10">
              <AiFillAudio size={24} />
            </span>
            {input ? (
              <span
                onClick={() => sendPrompt(input)}
                className="p-2 cursor-pointer rounded-full hover:bg-gray-600/10"
              >
                <IoSendSharp size={24} />
              </span>
            ) : loading == true ? (
              <span
                onClick={() => sendPrompt(input)}
                className="p-2 cursor-pointer rounded-full bg-white/80"
              >
                <FaStopCircle size={24} />
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        <p className="text-xs text-center font-medium mt-4 text-gray-700">
          Gemini clone can make mistakes, so double-check it!
        </p>
      </div>
    </main>
  );
};

export default MainPage;
