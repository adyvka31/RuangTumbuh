import { useState, useRef, useEffect } from "react";

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Halo! Saya bot RuangTumbuh. Ada yang bisa dibantu?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    // Tampilkan pesan user di UI
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {

 const response = await fetch("http://127.0.0.1:5001/api/chatbot", {   // ← pakai relative path
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
     // Debug: cek status response
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      console.log("Response status:", response.status);

      if (data.reply) {
        const botMessage = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.reply,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "bot", text: "Maaf, koneksi ke server terputus." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, input, setInput, isTyping, chatBodyRef, handleSend };
};