"use client";
import AwardedBidTable from "@/app/components/AwardedBidTable";
import BidTable from "@/app/components/BidTable";
import BillTable from "@/app/components/BillTable";
import UserCard from "@/app/components/UserCard";

import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UserDetails {
  id: number;
  username: string;
  is_admin: boolean;
}

export default function Profile() {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userIdString = searchParams.get("userId");

  // Convert the string to a number, defaulting to null if it's not a valid number
  const userId: number | null = userIdString ? parseInt(userIdString, 10) : null;
  const defaultUserId: number = 0; 
  const safeUserId = userId !== null ? userId : -1; // Example default value



  useEffect(() => {
    const getUserDetail = async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        credentials: "include",
      });

      const content = await response.json();
      console.log("RRRRRRR", content);
      if (content.id) {
        // User is authenticated and logged out
        setUserDetails(content);
      }
    };

    getUserDetail();
    console.log(userDetails);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="bg-beige h-full">
          <UserCard username={userDetails?.username || "Guest"} />
        </div>
        <div className=" h-full col-span-3 p-2 mt-8">
          <Tabs aria-label="Options mt-2">
            <Tab key="history" title="Bid History">
              <Card>
                <CardBody>
                <BidTable userId={safeUserId} />
                </CardBody>
              </Card>
            </Tab>
            {/* <Tab key="Bills" title="My Bills">
              <Card>
                <CardBody>
                  <BillTable/>
                </CardBody>
              </Card>
            </Tab> */}
            <Tab key="user_items" title="My Awarded Items">
              <Card>
                <CardBody>
                  <AwardedBidTable userId={safeUserId} />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
