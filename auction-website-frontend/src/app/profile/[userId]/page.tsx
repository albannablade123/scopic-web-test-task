"use client"
import BidTable from "@/app/components/BidTable";
import BillTable from "@/app/components/BillTable";
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
            <Tab key="history" title="Bid History">
              <Card>
                <CardBody>
                  <BidTable/>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="Bills" title="My Bills">
              <Card>
                <CardBody>
                  <BillTable/>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="user_items" title="My Items">
              <Card>
                <CardBody>
                  <BillTable/>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
