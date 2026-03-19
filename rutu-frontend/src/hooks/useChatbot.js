import { useState, useEffect, useRef } from "react";

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Ada yang bisa RuangTumbuh bantu? Tanya apa saja seputar kelas, komunitas, atau fitur kami!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, sender: "user" },
    ]);
    setInput("");

    // Logika animasi mengetik dengan delay natural
    setTimeout(() => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "Mohon maaf, Saat ini otak AI RuangTumbuh masih dalam tahap maintenance. Nantikan update fitur kecerdasan kami segera! 🚀",
            sender: "bot",
          },
        ]);
      }, 1500);
    }, 400);
  };

  return { messages, input, setInput, isTyping, chatBodyRef, handleSend };
};
