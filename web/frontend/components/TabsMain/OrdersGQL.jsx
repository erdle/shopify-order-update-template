import { useEffect } from "react"
import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import axios from "axios";
const OrdersGQL = () => {
    const app = useAppBridge();

    const closeOrdersGQL = async () => {
        const token = await getSessionToken(app);
        console.log("token :- ", token);
        const config = {

            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false
            }

        }

        const {data} = await axios.get('/api/graphql/orders/delete/id', config);
        console.log("orders : ", data);
    }
    const getAllOrdersGQL = async () => {
        const token = await getSessionToken(app);
        console.log("token :- ", token);
        const config = {

            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false
            }

        }

        const {data} = await axios.get('/api/graphql/orders', config);
        console.log("orders : ", data);
    }
    useEffect(() => {
        getAllOrdersGQL()
    
    
    }, [])
    
  return (
    <div>OrdersGQL</div>
  )
}

export default OrdersGQL