import { Tabs, Card, Button } from "@shopify/polaris";
import { useState, useCallback } from 'react'
import DashboardForm from "./DashboardForm";
import OrderTab from "./OrderTab";
import ProductTab from "./ProductTab";
import {
  MobileBackArrowMajor
} from '@shopify/polaris-icons';
import { useNavigate } from "react-router-dom";
import ProductGQL from "./ProductGQL";
import OrdersGQL from "./OrdersGQL";
import CustomersGQl from "./CustomersGQl";
import Widgit from "./Widgit";
const Tab = () => {
  const [selected, setSelected] = useState(0);
  const history = useNavigate()
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  const tabs = [
    {
      id: 'CustomersGQl',
      content: "CustomersGQl",
      accessibilityLabel: "All customers"
    },
    {
      id: 'OrdersGQL',
      content: "OrdersGQL",
      accessibilityLabel: "All customers"
    },{
      id: 'ProductsGQL',
      content: "ProductsGQL",
      accessibilityLabel: "All customers"
    },
    {
      id: 'Dashboard',
      content: "Dashboard",
      accessibilityLabel: "All customers"
    }, {
      id: 'Products',
      content: "Products",
      accessibilityLabel: "All customers"

    }, {
      id: 'Orders',
      content: "Orders",
      accessibilityLabel: "All customers"
    }, 
  ]
  return (
    <>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
        <Card.Section> 
        {selected === 0 && <Widgit/>}
        {selected === 1 && <CustomersGQl/>}
        {selected === 2 && <OrdersGQL/>}
          {selected === 3 && <ProductGQL />}
        {
          selected === 4 && <DashboardForm />
        }
          {
            selected === 5 && <ProductTab />
          }
        
          {selected === 6 && <OrderTab />}
        </Card.Section>
      </Tabs>
    </>
  )
}

export default Tab