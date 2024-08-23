"use client"
import AwardedBidTable from "@/app/components/AwardedBidTable";
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
        <div className=" h-full col-span-3 p-2 mt-8">
          <Tabs aria-label="Options mt-2">
            <Tab key="history" title="Bid History">
              <Card>
                <CardBody>
                  <BidTable/>
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
                  <AwardedBidTable/>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
