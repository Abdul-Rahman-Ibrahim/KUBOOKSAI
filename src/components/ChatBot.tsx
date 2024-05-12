/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Drawer, Popconfirm } from "antd";
import { VscSend } from "react-icons/vsc";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { QuestionCircleOutlined } from "@ant-design/icons";
import TextareaAutosize from "react-textarea-autosize";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface Message {
  text: string;
  sender: "user" | "bot";
  image?: string;
}

interface ChatBotProps {
  show: boolean;
  onClose?: () => void;
}

const ChatBot = ({ show, onClose }: ChatBotProps) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // const [questionCount, setQuestionCount] = useState(0);
  const { data: session } = useSession();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const closeDrawerRight = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      toast.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  // ===== Save Messages to LocalStorage =====
  const saveMessagesToStorage = (messagesToSave: Message[]) => {
    localStorage.setItem("chatMessages", JSON.stringify(messagesToSave));
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==== ChatBox APi and Responses ====
  const sendMessage = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      // ===== Chat History ======
      const chatHistory = messages.map((message) => message.text).join("\n");

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD4ks43zw7vnA0oJqiWrUmL5IRW87YRslc",
        {
          contents: [{ parts: [{ text: chatHistory }, { text: question }] }],
        }
      );

      const answer = response.data.candidates[0].content.parts[0].text;

      const newMessage: Message = { text: question, sender: "user" };
      const botMessage: Message = { text: answer, sender: "bot" };

      const updatedMessages = [...messages, newMessage, botMessage];
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        text: "Sorry, something went wrong!",
        sender: "bot",
      };
      const updatedMessages = [...messages, errorMessage];
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);
    }
    setLoading(false);
    setQuestion("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  // ==== Bolding Asterisks ====
  const renderMessageText = (text: string) => {
    // Check if the message is from the bot and contains asterisks
    if (text && text.includes("*")) {
      // Split the message into parts by asterisks
      const parts = text.split("*");
      return (
        <span>
          {parts.map((part, index) => {
            // Bold the parts of the message between asterisks
            if (index % 2 === 1) {
              return <b key={index}>{part}</b>;
            } else {
              return <span key={index}>{part}</span>;
            }
          })}
        </span>
      );
    } else {
      return text;
    }
  };

  // ===== Clear Chats ======
  const handleClearChats = () => {
    setMessages([]);
    // setQuestionCount(0);
    localStorage.removeItem("chatMessages");
    toast.success("Chats cleared successfully!");
  };

  const cancel = () => {
    toast.error("You Clicked on No");
  };

  //  ====== Click on Enter to Submit -=====
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      <div>
        <Drawer
          placement="right"
          open={show}
          width={500}
          title={
            <div>
              <h1 className="text-center text-lg capitalize font-bold">
                Hello, {session?.user?.name}
              </h1>
              <p className="text-center text-lg capitalize font-medium">
                Interact With KU{" "}
                <span className=" text-yellow-400 font-bold">Books</span> AI
              </p>
            </div>
          }
          onClose={closeDrawerRight}
          className="z-40 shadow-xl overflow-hidden"
        >
          <div className="flex h-full w-full flex-col overflow-hidden -mt-6">
            <div
              ref={chatContainerRef}
              className="grid gap-y-3 w-full overflow-y-auto pt-5 pb-10 sm:mx-4 px-2"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`grid gap-y-1 items-center bg-slate-50 p-2 rounded-md ${
                    message.sender === "user" ? "user" : "bot"
                  }`}
                >
                  <div>
                    {message.sender === "user" ? (
                      <div className="flex gap-2 items-start">
                        {/* <Image
                          src="/images/user.png"
                          width={32}
                          height={32}
                          alt="user"
                          objectFit="contain"
                          className="border-2 rounded-full"
                        /> */}
                        <img
                          src="/images/user.png"
                          alt="bot"
                          className="rounded-full object-contain w-8 h-8 border-2 p-0.5"
                        />
                        <div className="py-1">
                          <h4 className="font-bold pb-0.5">You</h4>
                          <p>{renderMessageText(message.text)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-start">
                        {/* <Image
                          src="/images/chatgpt2.png"
                          width={30}
                          height={30}
                          objectFit="contain"
                          alt="user"
                          className="border-2 rounded-full p-0.5"
                        /> */}
                        <img
                          src="/images/chatgpt2.png"
                          alt="user"
                          className="rounded-full object-contain w-8 h-8 border-2 p-0.5"
                        />
                        <div className="py-1">
                          <h1 className="font-bold pb-1">KU Books AI</h1>
                          {message.sender === "bot" &&
                          index === messages.length - 1 &&
                          loading ? (
                            <h1 className="typing-loader"></h1>
                          ) : (
                            <p>{renderMessageText(message.text)}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* {loading && <Spin className="mb-4 text-left" />} */}
            </div>
            <form
              onSubmit={handleSubmit}
              className="  sm:mx-auto left-0 right-0 py-2 px-3 sm:px-8 bottom-0 absolute bg-white border-t-2 border-yellow-400"
            >
              <div className="flex border-2 rounded-lg items-end">
                <TextareaAutosize
                  ref={textareaRef}
                  rows={2}
                  maxRows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="true"
                  autoFocus
                  disabled={loading}
                  placeholder="Ask Me About a Book..."
                  className="disabled:opacity-50 resize-none w-full bg-transparent px-3 py-2.5 text-base outline-none"
                />
                <button
                  type="submit"
                  className="py-2 px-3 bg-yellow-40 text-3xl text-center text-black font-semibold"
                >
                  <VscSend />
                </button>
              </div>
            </form>
            {/* {questionCount >= 10 && ( */}
            <Popconfirm
              title="Clear Chats"
              description="Are you sure want to Clear Chats?"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "white",
                  }}
                />
              }
              onConfirm={handleClearChats}
              onCancel={cancel}
              color="yellow"
              className="text-white"
              okText="Confirm"
              cancelText="Cancel"
            >
              {messages.length > 0 && (
                <button
                  type="button"
                  className="absolute bottom-24 right-4 p-1.5 bg-white border-2 border-yellow-400 z-50 rounded-full"
                >
                  {/* <Image
                    src="/images/dumpster.gif"
                    width={34}
                    height={34}
                    objectFit="contain"
                    alt="user"
                    className=" rounded-full"
                    unoptimized
                  /> */}
                  <img
                    src="/images/dumpster.gif"
                    alt="clear"
                    className="rounded-full object-contain w-8 h-8"
                  />
                </button>
              )}
            </Popconfirm>
            {/* )} */}
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default ChatBot;
