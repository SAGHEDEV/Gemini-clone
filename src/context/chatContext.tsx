import {
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import runChat from "../gemin.config/gemini";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Define the type for the context
interface ContextType {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  recentChat: string;
  setRecentChat: Dispatch<SetStateAction<string>>;
  recentChats: { id: string; chat: string }[];
  setRecentChats: Dispatch<SetStateAction<{ id: string; chat: string }[]>>;
  prevPrompts: string[];
  setPrevPrompts: Dispatch<SetStateAction<string[]>>;
  showResult: boolean;
  setShowResult: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  resultData: string;
  setResultData: Dispatch<SetStateAction<string>>;
  sendPrompt: (prompt: string) => void;
  getChatsFromDb: () => void;
}

// Initialize the context with a default value of `undefined`
export const chatContext = createContext<ContextType | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, firebaseLoading] = useAuthState(auth);

  const [input, setInput] = useState<string>("");
  const [recentChat, setRecentChat] = useState<string>("");
  const [recentChats, setRecentChats] = useState<
    { id: string; chat: string }[]
  >([]);
  const [prevPrompts, setPrevPrompts] = useState<string[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultData, setResultData] = useState<string>("");
  const [error, setError] = useState(false);

  const getChatsFromDb = async () => {
    console.log(user?.uid);
    const chatCollections = collection(
      db,
      "users",
      user?.uid as string,
      "chats"
    );

    try {
      const docsSnapshot = await getDocs(chatCollections);
      const documents = docsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(documents);
      setRecentChats(documents as any);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const addNewChat = async (prompt: string) => {
    try {
      await addDoc(collection(db, "users", user?.uid as string, "chats"), {
        chat: prompt,
      });
      getChatsFromDb();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const sendPrompt = async (prompt: string) => {
    setLoading(true);
    setResultData("");
    setShowResult(true);
    setRecentChat(prompt);
    setError(false);
    setTimeout(async () => {
      await runChat(prompt)
        .then((response) => {
          setResultData(response);
          setInput("");
          setLoading(false);
          if (!recentChats.some((item) => item.chat == prompt)) {
            addNewChat(prompt);
          }
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
          setInput("");
        });
      //   const response = await runChat(prompt);
      //   setResultData(response);
      //   setInput("");
      //   setLoading(false);
      //   setRecentChats((prev) => [...prev, prompt]);
    }, 2000);
  };

  const contextValue: ContextType = {
    input,
    setInput,
    recentChat,
    setRecentChat,
    recentChats,
    setRecentChats,
    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    sendPrompt,
    error,
    setError,
    getChatsFromDb,
  };

  if (firebaseLoading) {
    return null;
  }

  return (
    <chatContext.Provider value={contextValue}>{children}</chatContext.Provider>
  );
};

export default ContextProvider;
