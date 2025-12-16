// components/MessageProvider.jsx
import { useEffect } from "react";
import { useMessageStore } from "./useMessage";
import { Message } from "../components/dashboard/widgets";

const MessageProvider = () => {
  const { message, clearMessage } = useMessageStore();

  useEffect(() => {
    if (message) {
      // Limpia automáticamente después de 3 segundos (o el tiempo que quieras)
      const timer = setTimeout(() => clearMessage(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  if (!message?.text) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999999999999999999999999999]">
      <Message
        message={message.text}
        type={message.type}
        duration={3000}
        onClose={clearMessage}
      />
    </div>
  );
};

export default MessageProvider;
