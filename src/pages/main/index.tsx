import MainPage from "../../components/Main";
import ContextProvider from "../../context/chatContext";
import SIdeBar from "../../components/SideBar";

function ChatPage() {
  return (
    <ContextProvider>
      <div className="w-screen flex ">
        <SIdeBar />
        <MainPage />
      </div>
    </ContextProvider>
  );
}

export default ChatPage;
