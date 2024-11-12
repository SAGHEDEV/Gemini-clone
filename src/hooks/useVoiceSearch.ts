import "regenerator-runtime/runtime";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const start = SpeechRecognition.startListening;
  const stop = SpeechRecognition.stopListening;

  if (!browserSupportsSpeechRecognition) {
    return;
  }

  return { transcript, listening, resetTranscript, start, stop };
};
export default Dictaphone;
