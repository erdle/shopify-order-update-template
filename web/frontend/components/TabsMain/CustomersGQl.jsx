import { useAppBridge } from "@shopify/app-bridge-react"
import { getSessionToken } from "@shopify/app-bridge-utils";
import { ActionList, Button, Card, DataTable, FormLayout, Frame, InlineError, Modal, Pagination, Popover, Stack, TextField } from "@shopify/polaris";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { EditMajor, DeleteMajor } from '@shopify/polaris-icons';
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import ModalActivator from "../Utils/ModalActivator";
import Toasting from "../Utils/Toasting";


const CustomersGQl = () => {
    const app = useAppBridge();
    const history = useNavigate();
    const [allCustomers, setAllCustomers] = useState([]);
    const [singleCustomer, setsingleCustomer] = useState([]);
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [activeMod, setActiveMod] = useState(false);
    const [searchCategory, setSearchCategory]  = useState(null)

    console.log("allCustomers", allCustomers);
    const [deleteProdId, setDeleteProdId] = useState()
    const [updateProdId, setupdateProdId] = useState()
    const [active, setActive] = useState(false);
    const handleFirstNameChange = useCallback((e) => setfirstName(e))
    const handleLastNameChange = useCallback((e) => setlastName(e))
    const [deleteProdToast, setDeleteProdToast] = useState(false)
    const [errorMessage, setErrorMessage] = useState({
        firstName: false,
        lastName: false,

    })
    const [activeToast, setActiveToast] = useState(false);

    const toggleActive = useCallback(() => setActiveToast((activeToast) => !activeToast), []);

    const toggleModalDel = useCallback(() => setActiveMod((active) => !active) && setLoading(false), []);
    const toggleModal = useCallback(() => setActive((active) => !active), []);
    const toggleDelProdActive = useCallback(() => setDeleteProdToast((activeToast) => !activeToast), []);


        //Sorting popover starts here
    const [reverseValue, setReverseValue] = useState(false)
    const [popoverActive, setPopoverActive] = useState(false);

    const popoverToggleActive = useCallback(() => setPopoverActive((active) => !active), []);
  
    const handleAZAction = useCallback(
      () => {
        console.log('Imported action');
        setSearchCategory("NAME")
        setReverseValue(false)
      },
      [],
    );
    const handleNoneAction = useCallback(() =>{
        console.log('None action');
        
        setReverseValue(false)
    }, [])
  
    const handleZAAction = useCallback(
      () => {
        console.log('Imported action');
        setSearchCategory("NAME")
        setReverseValue(true)
      },
      [],
    );
  
    const popoverActivator = (
      <Button onClick={popoverToggleActive} disclosure>
       Sort BY
      </Button>
    );
    //Sorting popover ends here



//Pagination starts

const [forwardCursor, setForwardCursor] = useState(null);
    const [backwardCursor, setBackwardCursor] = useState(null);
    const [backwardCursorString, setBackwardCursorString] = useState(null);
    const [forwardCursorString, setForwardCursorString] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [firstNumProd, setFirstNumProd] = useState("$numProds");
    const [lastNumProd, setLastNumProd] = useState(null);

const prevData = () => {
        setBackwardCursor(backwardCursorString)
        setForwardCursor(null)
        setLastNumProd("$numProds")
        setFirstNumProd(null)
        if (prevPage === false) {
            setBackwardCursor(null)
        }
    }
    const nextData = () => {
        // setCurrentPage(currentPage + 1)
        setLastNumProd(null)
        setFirstNumProd("$numProds")
        setForwardCursor(forwardCursorString)
        setBackwardCursor(null)
        if (nextPage === false) {
            setForwardCursor(null)
        }

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

//Pagination ends


    // Data Table starts
    const rows = allCustomers.map((item) => [
        [item.node.id],
        [item.node.firstName],
        [item.node.lastName],
        [
            <div onClick={
                () => getSingleCustomer(item.node.id)
            }>
                <Button onClick={toggleModal}><EditMajor />
                </Button>
            </div>],
        [

            <div style={
                {
                    width: "2rem",
                    cursor: "pointer"
                }
            }
                onClick={
                    // () => console.log("Hello")
                    () => setDeleteProdId(item.node.id)
                }>
                <DeleteMajor onClick={toggleModalDel} />
            </div>,

        ],
    ])
    // Data Table ends


    //Modal starts here

    const [Loading, setLoading] = useState(false);

    function displayModal() {
        return (
            <>
                <Modal open={active}
                    onClose={toggleModal}
                    title={`Update Product`}
                    secondaryActions
                    ={
                        {
                            content: "Close",
                            onAction: toggleModal
                        }
                    }
                    primaryAction={
                        {
                            content: Loading === true ? <><Loader /></> : "Update Customer",
                            onAction: submitHandler
                        }
                    }>
                    <Modal.Section> {
                        <>
                            <Stack vertical>
                                <Stack.Item> {
                                    singleCustomer.id ? <>
                                        <FormLayout>
                                            <TextField label="First Name" type="text"
                                                value={firstName}
                                                requiredIndicator={true}
                                                onChange={handleFirstNameChange} />

                                            <InlineError message={
                                                errorMessage.name && "First name is required"
                                            } />

                                            <TextField label="Last Name" type="text"
                                                value={lastName}
                                                requiredIndicator={true}
                                                onChange={handleLastNameChange} />

                                            <InlineError message={
                                                errorMessage.description && "Last Name is required"
                                            } />




                                        </FormLayout>
                                    </> : <Loader />
                                } </Stack.Item>
                            </Stack>
                        </>
                    } </Modal.Section>
                </Modal>

            </>


        )
    }

    function deleteProductModalDisplay() {
        return (
            <div>
                <ModalActivator primaryActionContent='Delete Customer' modalTitle="Confirm Delete Customer"
                    containerContent={`By clicking "Delete Customer" customer will be deleted`}
                    openModal={activeMod}
                    openDelModal={toggleModalDel}
                    closeModal={toggleModalDel}
                    secondaryActionsContent="Cancel"
                    load={Loading}
                    primaryActionOnAction={
                        productDeleteSubmmitHandler
                    } />
            </div>
        )
    }
    //Modal ends here


    // API starts
    const filterValues = {
        reverseValue,searchCategory, forwardCursor, backwardCursor, nextPage, prevPage, firstNumProd, lastNumProd
    }
    const getAllCustomers = async (filterValues) => {
        const token = await getSessionToken(app);
        console.table("token:-", token);
        const config = {
            headers: {
                Authorization: 'Bearer ' + token

            },
            body: JSON.stringify(filterValues),
        }
        const { data } = await axios.post(`/api/customers/all`,filterValues, config);
        console.log("customers", data);
        setAllCustomers(data.data.body.data.customers.edges)
        console.log("Result", data);
            // console.log("customers with query", data.data.body.data.customers.edges);
            console.log("Cursor", data.data.body.data.customers.pageInfo);
           
            setForwardCursorString(data.data.body.data.customers.pageInfo.endCursor)
            setBackwardCursorString(data.data.body.data.customers.pageInfo.startCursor)
            setPrevPage(data.data.body.data.customers.pageInfo.hasPreviousPage)
            setNextPage(data.data.body.data.customers.pageInfo.hasNextPage)
       
    }
    const prodData = { firstName, lastName }
    const submitHandler = () => {
        if (!firstName) {
            setErrorMessage({ firstName: true });
        } else if (!lastName) {
            setErrorMessage({ lastName: true });
        } else {
            setLoading(true);
            console.log("Before Api", prodData);
            updateCustomer(prodData, updateProdId);
            history('/')
        }
    }
    const getSingleCustomer = async (id) => {

        const id2 = id.split('/').splice(-1)
        const token = await getSessionToken(app);;
        console.log("token:-", token);
        try {
            const config = {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
            const { data } = await axios.get(`/api/customer/${id2}`, config);
            console.log("customer", data.data.body.data.customer);
            setsingleCustomer(data.data.body.data.customer)
            setLoading(false)
            setupdateProdId(data.data.body.data.customer.id)
            setfirstName(data.data.body.data.customer.firstName)
            setlastName(data.data.body.data.customer.lastName)
        } catch (error) {
            console.log("customer", error);
        }
    }
    const productDeleteSubmmitHandler = () => {
        setLoading(true)
        deleteCustomer(deleteProdId)
    }
    const deleteCustomer = async (deleteProdId) => {
        const id = deleteProdId.split('/').splice(-1)
        console.log("deleteCustomer", id);
        const token = await getSessionToken(app);
        console.log("token :- ", token);
        const config = {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/customer/delete/${id}`, config)
            console.log("Deleted customer", data);
            if (data.success === true) {
                setLoading(true);
                toggleModalDel()
                getAllCustomers(filterValues);
                setDeleteProdToast(true)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const updateCustomer = async (prodData, updateProdId) => {
        const id = updateProdId.split('/').splice(-1)
        console.log(updateProdId);
        const token = await getSessionToken(app);
        console.log("updateCustomer token :- ", token);
        const config = {
            headers: {
                Authorization: 'Bearer ' + token

            },
            body: JSON.stringify(prodData)
        }
        try {
            const { data } = await axios.put(`/api/customer/update/${id}`, prodData, config)
            console.log("updateCustomer", data);
            if (data.success === true) {
                setLoading(false)
                toggleModal()
                getAllCustomers(filterValues)
                setActiveToast(true)
            }
        } catch (error) {
            console.log(error);
        }

    }

    // API ends
    useEffect(() => {
        getAllCustomers(filterValues)
        // getSingleCustomer()
        // deleteCustomer()
        // updateCustomer();
    }, [forwardCursor,reverseValue, backwardCursor,searchCategory])
    return (
        <> {/* <h1>{allCustomers.map((item) =>(<>
    {item.node.id}
</>))}</h1> */}

{
                nextPage !== true ? <style>{cssNextEnable}</style> : <style>{cssNextDisable}</style>
            }
            {
                prevPage !== true ? <style>{cssPrevDisable}</style> : <style>{cssPrevEnable}</style>
            }
            <Popover
        active={popoverActive}
        activator={popoverActivator}
        autofocusTarget="first-node"
        onClose={popoverToggleActive}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            {
              content: 'None',
              onAction: handleNoneAction,
            },
            {
              content: 'A-Z',
              onAction: handleAZAction,
            },
            {
              content: 'Z-A',
              onAction: handleZAAction,
            },
          ]}
        />
      </Popover>
            {!allCustomers.length ? (<Loader />) : (
                <Card>
                    <Frame>
                        <DataTable columnContentTypes={
                            [
                                'text',
                                'text',
                                'text',
                                'text',
                                'text',
                            ]
                        }
                            headings={
                                [
                                    'Customer ID',
                                    'FirstName',
                                    'LastName',
                                    'Edit',
                                    'Delete',
                                ]
                            }
                            rows={rows}
                        //   totals={['', '', '', 255, '$155,830.00']}
                        />
                        <Toasting content="Customer Updated Successfully"
                            active={activeToast}
                            toggledissmiss={toggleActive} />
                        <Toasting content="Customer Deleted Successfully"
                            active={deleteProdToast}
                            toggledissmiss={toggleDelProdActive} />
                             <div className="my-3 d-flex justify-content-center">
                                <div>

                                    <Pagination hasPrevious
                                        onPrevious={prevData}
                                        hasNext
                                        onNext={nextData} />
                                </div>
                            </div>
                    </Frame>
                    {displayModal()}
                    {deleteProductModalDisplay()}
                </Card>

            )}

        </>
    )
}

export default CustomersGQl
