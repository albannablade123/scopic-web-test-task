"use client"
import BidTable from "@/app/components/BidTable";
import UserCard from "@/app/components/UserCard";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

export default function Profile() {
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="bg-slate-600 h-full">
          <UserCard />
        </div>
        <div className="bg-red-600 h-full col-span-3 ">
          <Tabs aria-label="Options">
            <Tab key="photos" title="Photos">
              <Card>
                <CardBody>
                  <BidTable/>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="music" title="Music">
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
