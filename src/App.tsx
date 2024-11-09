import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/main";
import WelcomeScreen from "./pages/welcome";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
