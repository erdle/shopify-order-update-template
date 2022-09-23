import {
    Link,
    Page,
    Card,
    DataTable,
    Tag,
    Badge,
    Pagination,
    Frame
} from "@shopify/polaris";
import {useState, useCallback, useEffect} from "react";

import axios from 'axios'
import {getSessionToken} from '@shopify/app-bridge-utils'
import {useAppBridge} from "@shopify/app-bridge-react"
import {DeleteMajor, EditMajor} from '@shopify/polaris-icons';
// import Pagination from "react-js-pagination";
import {useNavigate} from "react-router-dom";
import Loader from "../Loader/Loader";
import ModalActivator from "../Utils/ModalActivator";
import Toasting from "../Utils/Toasting";
// import '../styles/Tabs.css'
const OrderTab = () => {

    const app = useAppBridge();
    const history = useNavigate();
    const [sortedRows, setSortedRows] = useState(null);
    const [deleteOrderModal, getDeleteOrderModal] = useState(false)
    const [allOrders, setAllOrders] = useState([]);
    const [getId, setGetId] = useState(0);
    const [deleteOrderToast, setDeleteOrderToast] = useState(false)
    let [currentPage, setCurrentPage] = useState(1);
    const [activeMod, setActiveMod] = useState(false);
    const [Loading, setLoading] = useState(false)
    const toggleModal = useCallback(() => setActiveMod((active) => !active), []);
    const rowsPerPage = 5
    const count = allOrders.length
    const totalPages = Math.ceil(count / rowsPerPage)
    const calculatedRows = allOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    console.log(calculatedRows);

    const toggleDelOrderActive = useCallback(() => setDeleteOrderToast((activeToast) => !activeToast), []);
    const updateRedirect = (id) => { // console.log("ID from link:", id);
        history(`/order/update/${id}`)
    }

    const prevData = () => {
        setCurrentPage(currentPage - 1)
        console.log(currentPage);
    }
    const nextData = () => {
        setCurrentPage(currentPage + 1)
    }

    const cssNextEnable = `
    #nextURL {
        pointer-events: none !important;
    }
`
    const cssNextDisable = `
    #nextURL {
        pointer-events: auto !important;
    }
`
    const cssPrevDisable = `
    #previousURL {
        pointer-events: none !important;
    }
`
    const cssPrevEnable = `
    #previousURL {
        pointer-events: auto !important;
    }
`

    const getSingleOrderDetail = async (id) => {
        setLoading(true)
        const token = await getSessionToken(app)
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        const {data} = await axios.get(`/api/order/${id}`, config)

        console.log(data);
        setGetId(id)
        setLoading(false)
        console.log("ID", id);
    }


    const deleteHandler = async () => {
        const token = await getSessionToken(app)
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        const {data} = await axios.delete(`/api/order/delete/${getId}`, config)
        if (data.success === true) {
             getAllOrders();
            setLoading(false)
            setActiveMod(false)
            setDeleteOrderToast(true)
        }
        console.log(data);
        console.log("Success", data.success);
    }

    const deleteOrderSubmitHandler = () => {
        setLoading(true)
      deleteHandler()
    }
    const initiallySortedRows = calculatedRows.map((item) => ([
        [
            <div>{
                item.id
            }</div>],
        [item.line_items.map((j) => ([
                <div className="mb-1">
                    {
                    j.name
                }</div>
            ]))],

        [item.total_price],
        [
            <Tag>{
                item.financial_status
            }</Tag>],
        [item.fulfillment_status === null ? <Badge status="warning">unfullfilled</Badge> : <Badge status="success">
            {
            item.fulfillment_status
        }</Badge>],
        // [deleteOrderModalDisplay(item.id)],
        [
            <div style={{width:"2rem", cursor: "pointer"}} onClick={() =>getSingleOrderDetail(item.id)}>

            <DeleteMajor onClick={
                toggleModal
            }/>
            </div>
        ]

    ]));

    function deleteOrderModalDisplay() {
        return (
            <div>
                <ModalActivator primaryActionContent='Delete Order' modalTitle="Confirm Delete Order"
                    containerContent={`By clicking "Delete Order" order will be deleted`}
                    openModal={activeMod}
                    openDelModal={toggleModal}
                    closeModal={toggleModal}
                    secondaryActionsContent="Cancel"
                    load={Loading}
                    primaryActionOnAction={deleteOrderSubmitHandler
                       
                    }/>
            </div>
        )
    }

    // const app = useAppBridge();
    if (currentPage > 1 && calculatedRows.length === 0) {
        setCurrentPage(currentPage - 1)
        console.log(currentPage);
    }

    const getAllOrders = async () => {
        const token = await getSessionToken(app);
        console.log("token :- ", token);
        const config = {

            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false
            }

        }

        const {data} = await axios.get('/api/orders/all', config);
        console.log("orders : ", data);
        setAllOrders(data)

    }
    const rows = sortedRows ? sortedRows : initiallySortedRows;
    useEffect(async () => {
        getAllOrders()

    }, []);

    return (
        <Page> {
            totalPages === currentPage ? <style>{cssNextEnable}</style> : <style>{cssNextDisable}</style>
        }
            {
            currentPage === 1 ? <style>{cssPrevDisable}</style> : <style>{cssPrevEnable}</style>
        }
                <Frame >
            <Card> 
           
            {
                !allOrders.length ? <>
                    <><Loader/></>
                </> : <>
                
                    <DataTable columnContentTypes={
                            [
                                "text",
                                "text",
                                "number",
                                "text",
                                "text",
                                "",
                                "text",
                            ]
                        }
                        headings={
                            [
                                "OrderID",
                                "Products",
                                "Amount",
                                "Financial Status",
                                "Fullfillment Status",
                                "",
                                "Delete",
                            ]
                        }
                        rows={rows}

                        footerContent={
                            `Showing ${currentPage} of ${totalPages} results`
                        }/>
                        
                    <div className='d-flex  mt-2 justify-content-center'>
                        <div>

                            <Pagination hasPrevious
                                onPrevious={prevData}
                                hasNext
                                onNext={nextData}/>
                        </div>
                    </div>
                    {deleteOrderModalDisplay()}
                    <Toasting content="Order Deleted Successfully"
                                active={deleteOrderToast}
                                toggledissmiss={toggleDelOrderActive} />

                </>
            } </Card>
                </Frame>

        </Page>
    );


}

export default OrderTab
