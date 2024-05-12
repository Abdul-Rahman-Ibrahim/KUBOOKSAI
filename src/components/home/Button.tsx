/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import ChatBot from "@/components/ChatBot";
import Image from "next/image";
import { Modal } from "antd";
import { signIn, useSession } from "next-auth/react";

const Button = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { data: session } = useSession();

  const openDrawerRight = () => {
    if (session?.user) {
      setShowChatBot(true);
    } else {
      setOpenModal(true);
    }
  };

  const closeDrawerRight = () => {
    setShowChatBot(false);
  };

  return (
    <div>
      <div
        onClick={openDrawerRight}
        className="bottom-8 right-8 fixed shadow-md bg-white border-2 border-yellow-300 cursor-pointer p-2 rounded-full z-50"
      >
        {/* <Image
          src="/images/chatbot.png"
          alt="chatbot"
          width={40}
          height={40}
          priority
          quality={100}
          className="object-contain animate-bounce"
          loading="eager"
          unoptimized
        /> */}
        <img   src="/images/chatbot.png"
          alt="chatbot" className="object-contain animate-bounce w-10 h-10" />
      </div>
      <ChatBot show={showChatBot} onClose={closeDrawerRight} />
      <Modal
        open={openModal}
        closable={false}
        width={400}
        centered
        footer={null}
      >
        <div className="grid gap-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-5 justify-center w-full bg-gray-50 py-2 border text-lg font-bold rounded-lg"
          >
            {/* <Image
              src="/images/googlesvg.png"
              alt="google"
              width={30}
              height={30}
              className="object-contain"
            /> */}
            <img  src="/images/googlesvg.png"
              alt="google"  className="object-contain w-8 h-8" />
            <h1>Continue with Google</h1>
          </button>
          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center bg-gray-50 bg-opacity-80 gap-4 py-2 border  text-lg font-bold rounded-lg"
          >
            {/* <Image
              src="/images/github.png"
              alt="github"
              width={36}
              height={36}
              className="object-contain"
            /> */}
            <img  src="/images/github.png"
              alt="github"  className="object-contain w-9 h-9" />
            <h1>Continue with Github</h1>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Button;
