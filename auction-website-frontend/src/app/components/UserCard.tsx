"use client";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
// import NotificationSettings from "./NotificationSettings";

interface UserCardProps {
  username: string;
}

export default function UserCard({ username }: UserCardProps) {
  const dummyNotificationSettings = {
    newBid: true,
    biddingFinished: false,
    bidAmountState: false,
    exceedsMaxBid: true,
  };
  const [notifications, setNotifications] = useState(dummyNotificationSettings);
  useEffect(() => {
    const getUserId = async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        credentials: "include",
      });

      const content = await response.json();

      console.log(content);
    };

    getUserId();
  }, []);

  const handleNotificationChange = (event :  ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [name]: checked,
    }));
  };
  return (
    <Card className="max-w-[400px] mx-auto mt-4">
      <Divider />
      <CardBody className="text-center">
        <Image
          alt=""
          src={"/profile.png"}
          width={200}
          height={100}
          style={{ borderRadius: "50%" }}
          className="mx-auto my-10"
        />
        <h3 className="text-left ml-4 font-semibold">User Details</h3>
        <hr className="mb-3" />

        <div>Name: {username}</div>
        <div>Email: test@mail.com</div>
        <div>Date Joined: </div>

        {/* <h3 className="text-left ml-4 mt-3 font-semibold">
          Notification Settings
        </h3> */}

        <hr className="mb-2" />
        {/* <NotificationSettings
          notifications={dummyNotificationSettings}
          onChange={handleNotificationChange}
        /> */}
      </CardBody>
      <Divider />
    </Card>
  );
}
