/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Button, Drawer } from "antd";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Profile = () => {
  const [openNav, setOpenNav] = useState(false);
  const { status, data: session } = useSession();

  const openDrawer = () => setOpenNav(true);
  const closeDrawer = () => setOpenNav(false);
  useEffect(() => {
    if (status === "authenticated") {
      toast.success("Logged In Successful");
    }
  }, [status]);

  return (
    <div>
      <div onClick={openDrawer}>
        {session?.user && (
          // <Image
          //   src={session?.user?.image || ""}
          //   width={40}
          //   height={40}
          //   loading="eager"
          //   alt="profile"
          //   className="rounded-full object-contain border cursor-pointer"
          // />
          <img
            src={session?.user?.image || ""}
            alt="profile"
            className="rounded-full object-contain border cursor-pointer w-11 h-11"
          />
        )}
      </div>
      <Drawer
        closable={false}
        placement="top"
        open={openNav}
        height={240}
        onClose={closeDrawer}
        className="z-50 transition-all ease-in  text-black relative"
      >
        <button onClick={closeDrawer}>
          <AiOutlineClose className="w-8 h-8 absolute right-4 top-4" />
        </button>
        <div className="pt-10 grid place-content-center place-items-center gap-y-4">
          <h1 className=" uppercase font-semibold text-2xl">
            {session?.user?.name}
          </h1>
          <Button
            type="primary"
            onClick={() => {
              signOut();
              closeDrawer();
              toast.success("Logout Successfully");
            }}
            className="bg-yellow-400 text-xl h-12"
          >
            Logout
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Profile;
