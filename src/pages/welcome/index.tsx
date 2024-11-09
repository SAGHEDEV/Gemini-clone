import { Link, useNavigate } from "react-router-dom";
import HomeMan from "../../assets/home-man.jpg";
import GeminiIcon from "../../assets/gemini-icon.png";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase-config/firebase";
import {
  setPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  // getRedirectResult,
  // signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { notification } from "antd";
// import { useEffect } from "react";

const WelcomeScreen = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignInUser = async () => {
    await setPersistence(auth, browserSessionPersistence);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then(() => {
        navigate("/chat");
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: `Error ${error?.code || "Unknown Error"}!`,
          description: `${
            error.message || "An error occurred, please try again."
          }`,
        });
      });
  };

  if (loading) {
    return <div className="w-screen h-screen bg-blue-200 animate-pulse"></div>;
  }
  if (user) {
    navigate("/chat");
  }

  return (
    <div className="w-full lg:h-screen overflow-hidden">
      <header className="w-full flex justify-between items-center p-7">
        <p className="text-xl font-light">Gemini</p>
        <div className="flex justify-end items-center gap-3">
          <div className="hidden md:flex justify-center items-center gap-1">
            <Link
              to="#"
              className="p-2 px-4 rounded-full text-sm font-semibold text-blue-800 hover:bg-blue-800/10 "
            >
              Try Gemini Advanced
            </Link>
            <Link
              to="#"
              className="p-2 px-4 rounded-full text-sm font-semibold text-blue-800 hover:bg-blue-800/10 "
            >
              For Developers
            </Link>
            <Link
              to="#"
              className="p-2 px-4 rounded-full text-sm font-semibold text-blue-800 hover:bg-blue-800/10 "
            >
              For Business
            </Link>
          </div>
          <button
            onClick={() => handleSignInUser()}
            className="text-base font-semibold text-white bg-blue-800 p-3 px-6 rounded-full hover:bg-blue-700 active:scale-95"
          >
            Sign In
          </button>
        </div>
      </header>

      <div className="px-9 py-2 md:p-12 md:py-10 flex flex-col lg:flex-row justify-evenly items-center w-full gap-x-32 gap-y-8">
        <div>
          <motion.h1
            initial={{ top: 100, opacity: 0 }}
            animate={{ top: 0, opacity: 1 }}
            transition={{ bounce: 0.8, duration: 1 }}
            className="relative text-[90px] md:text-[140px] w-fit bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 bg-clip-text text-transparent md:leading-[140px] !m-0 p-0"
          >
            Gemini
          </motion.h1>
          <p className="text-2xl md:text-4xl font-medium text-left lg:max-w-[500px] mt-1">
            Supercharge your creativity and productivity
          </p>
          <p className="mt-6 text-base md:text-xl lg:max-w-[500px]">
            Chat to start writing, planning, learning and more with Google AI
          </p>
          <button
            onClick={() => handleSignInUser()}
            className="p-3 px-6 rounded-xl bg-blue-200 text-blue-950 mt-5 shadow-xl font-medium hover:bg-blue-300"
          >
            Sign In
          </button>
        </div>
        <motion.div
          initial={{ top: 300, left: 300, opacity: 0 }}
          animate={{ top: 0, left: 0, opacity: 1 }}
          transition={{ delay: 0.5, bounce: 0.8, duration: 1 }}
          className="relative overflow-hidden"
        >
          <img
            src={HomeMan}
            alt="Generated Image"
            width={500}
            className="rounded-3xl xs:w-full sm:w-full md:w-full lg:w-[500px]"
          />
          <motion.div
            initial={{ bottom: -300, left: 300, opacity: 0 }}
            animate={{ bottom: -40, right: -128, opacity: 1 }}
            transition={{ dalay: 1.5, bounce: 0.8, duration: 2 }}
            className="absolute -bottom-10 p-8 w-96 max-h-[150px] rounded-2xl flex justify-start items-start gap-3 bg-white -right-32"
          >
            <img
              src={GeminiIcon}
              alt="Generated Image"
              width={30}
              className="animate-spin"
            />
            <p>
              Sure, here is a more clear and concise version of your email
              draft: Dear Professor [Professor’s name],
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
