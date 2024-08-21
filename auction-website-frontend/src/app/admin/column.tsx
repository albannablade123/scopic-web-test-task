export type Item = {
    id: String
    name: String
    expiry_time: String
    starting_price: String
}

import { Tooltip } from '@nextui-org/react';


import {EditIcon} from "../components/icons";
import {DeleteIcon} from "../components/icons";
import {EyeIcon} from "../components/icons";
import ItemAction from '../components/itemAction'

export const renderCell = (item: Item, columnKey: React.Key, fetchItems: Function ) => {
    const cellValue = item[columnKey as keyof Item]

    switch (columnKey) {
      case "actions":
        return <ItemAction id={item.id} fetchItems={fetchItems}/>;
      default:
        return cellValue;
    }
  }

export const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "description",
      label: "DESCRIPTION",
    },
    {
      key: "expiry_time",
      label: "EXPIRY TIME",
    },
    {
      key: "start_time",
      label: "START TIME",
    },
    {
      key: "large_image",
      label: "LARGE IMAGE",
    },
    {
      key: "starting_price",
      label: "STARTING PRICE",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
    {
      key: "is_closed",
      label: "CLOSED"
    }
  ];