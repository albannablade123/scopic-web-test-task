"use client";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
// import NotificationSettings from "./NotificationSettings";

interface UserCardProps {
  id: number;
  username: string;
  notification_email: string;
}

export default function UserCard({
  username,
  notification_email,
  id,
}: UserCardProps) {
  const [email, setEmail] = useState(notification_email);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (notification_email) {
      setEmail(notification_email);
    }
  }, [notification_email]);
  
  console.log(notification_email,"SSSSSS",email)
  const dummyNotificationSettings = {
    newBid: true,
    biddingFinished: false,
    bidAmountState: false,
    exceedsMaxBid: true,
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEmail(notification_email);
  };

  const handleSubmitClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/${id}/update-email`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const content = await response.json();
        console.log("Email updated successfully:", content);
        setIsEditing(false);
      } else {
        console.error("Failed to update email");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
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

  const handleNotificationChange = (event: ChangeEvent<HTMLInputElement>) => {
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

        <div className="mb-3">
          <div>
            Email:
            {isEditing ? (
              <Input
                className="ml-2"
                type="email"
                value={email}
                onChange={handleEmailChange}
                size="sm"
              />
            ) : (
              <span className="ml-2">{email}</span>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex justify-center space-x-2 mt-3">
            <Button  onClick={handleSubmitClick}>
              Submit
            </Button>
            <Button color="warning" onClick={handleCancelClick}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={handleEditClick} className="mt-3">
            Edit Email
          </Button>
        )}

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
