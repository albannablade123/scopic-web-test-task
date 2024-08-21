"use client";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { useEffect } from "react";

export default function UserCard() {
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



  return (
    <Card className="max-w-[400px] mx-auto">
      <Divider />
      <CardBody className="text-center">
        <div>Name: User Name</div>
        <div>Email: test@mail.com</div>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
      <Divider />
    </Card>
  );
}
