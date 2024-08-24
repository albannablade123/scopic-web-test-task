import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { BillService } from "../utils/actions/BillService";
import { Bill } from "../profile/column_bill";

interface BillModalProps {
  item_id: number;  // Adjust the type as needed (e.g., string if item_id is a string)
  name: string;
}

const BillModal: React.FC<BillModalProps> = ({ item_id, name }) => {
  const [billDetail, setBillDetail] = useState<Bill>();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const billService = new BillService();

  useEffect(() => {
    const fetchBill = async () => {
      const fetchedBill = await billService.getAllBillsByItemId(item_id);
      setBillDetail(fetchedBill);
    };
    setIsLoading(true);
    fetchBill();
    setIsLoading(false);
  }, [isLoading]);

  return (
    <>
      <Button
        className="bg-beige-dark font-semibold text-white"
        onPress={onOpen}
      >
        View Item Bill
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={true}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Bill - Purchase Order #{item_id}
              </ModalHeader>
              <ModalBody>
                <h2>
                  Hello <span className="font-bold">User X</span>
                </h2>
                <p>
                  Thank You for your recent transaction, You have succesfully
                  won the bid and is awarded the Product <span className="font-bold">{name}</span>, below are your
                  purchase detail
                </p>
                <div className="col-span-2 border-b border-black pb-2">
                  <div className="font-semibold">Billed To:</div>
                  <div>{billDetail?.billing_address}</div>
                </div>
                <div className="bg-beige p-2 grid grid-cols-2 min-h-40">
                  <div className="border-1 p-1 pl-3 max-h-10 border-black font-semibold">
                    Item
                  </div>
                  <div className="border-1 p-1 pl-3 max-h-10 border-black font-semibold">
                    Amount
                  </div>
                  <div className=" p-1 pl-3 mb-auto border-black self-start ">
                    {name}
                  </div>
                  <div className="p-1 pl-3 mb-auto">{billDetail?.amount}</div>
                  <div className="col-span-2 p-1 pl-3 mt-2 border-t border-black font-bold">
                    Total (including VAT):
                    <span className="float-right">
                      ${((billDetail?.amount ?? 0) * 1.2).toFixed(2)}
                    </span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>

              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default BillModal;
