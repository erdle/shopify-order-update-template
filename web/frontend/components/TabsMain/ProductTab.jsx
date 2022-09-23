import '../../Styles/table.css'
import {
    Button,
    DataTable,
    Card,
    Pagination,
    TextField,
    Stack,
    Modal,
    FormLayout,
    InlineError,
    Frame
} from "@shopify/polaris"
import { useCallback, useEffect, useState } from "react";
// import { allProducts } from "../Actions/productActions";
import { getSessionToken } from '@shopify/app-bridge-utils'
import { useAppBridge } from "@shopify/app-bridge-react"
import { EditMajor, DeleteMajor } from '@shopify/polaris-icons';

// import Pagination from "react-js-pagination";

import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader.jsx';
import Toasting from '../Utils/Toasting'
import ModalActivator from '../Utils/ModalActivator';

const ProductTab = () => {

    const app = useAppBridge();
    const history = useNavigate();

    const [products, setProducts] = useState([]);
    const [getId, setGetId] = useState(0);
    const [Loading, setLoading] = useState(false)
    const [deleteProdId, setDeleteProdId] = useState(0)
    const [deleteProdToast, setDeleteProdToast] = useState(false)

    // if (Loading === true) {
    //     return (<><Loader/></>)
    // }
    // **Pagination starts **
    const [singleProduct, setSingleProduct] = useState({});
    console.log(singleProduct);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10
    const count = products.length
    const totalPages = Math.ceil(count / rowsPerPage)
    const calculatedRows = products.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    console.log("calculatedRows", calculatedRows);
    const updateRedirect = (id) => { // console.log("ID from link:", id);
        history(`/update/${id}`)
    }

    // **Pagination ends **

    // ** modal starts **

    const getSingleProduct = async (id) => {
        const token = await getSessionToken(app);

        const config = {
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false
            }
        }

        const { data } = await axios.get(`/api/product/${id}`, config)
        console.log(data)
        // console.log(data.id);
        setDeleteProdId(data.id)
        setLoading(false)
        setSingleProduct(data)
        setGetId(data.id)
        setDesription(data.body_html)
        setName(data.handle)
        setCategory(data.product_type)
        setPrice(data.variants[0].price)
        setUrl(data.images[0].src)
    }
    const updateProduct = async (prodData) => {

        const token = await getSessionToken(app);
        console.log("token :- ", token);

        const config = {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prodData)

        }
        // setLoading(true)
        const { data } = await axios.put(`/api/product/update/${getId}`, prodData, config)
        if (data.success === true) {
            toggleModal()
            getAllProducts()
            setActiveToast(true)
            // setLoading(false)
        }
        console.log("Updated Data", data);
        // .catch((error) => console.log(error))

    }

    const [active, setActive] = useState(false);
    const toggleModal = useCallback(() => setActive((active) => !active), []);

    const [description, setDesription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState({
        name: false,
        price: false,
        category: false,
        url: false,
        description: false,
        color: false
    })
    const [activeToast, setActiveToast] = useState(false);
    const handleDescriptionChange = useCallback((e) => setDesription(e))
    const handlePriceChange = useCallback((e) => setPrice(e))
    const handleCategoryChange = useCallback((e) => setCategory(e))
    const handleNameChange = useCallback((e) => setName(e))
    const handleUrlChange = useCallback((e) => setUrl(e))
    const toggleActive = useCallback(() => setActiveToast((activeToast) => !activeToast), []);
    const toggleDelProdActive = useCallback(() => setDeleteProdToast((activeToast) => !activeToast), []);
    let prodData = {
        name,
        description,
        category,
        price,
        url
    }

    // function Loading(){
    //     return(<><Loader/></>)
    // }
    const submitHandler = () => {
        if (!name) {
            setErrorMessage({ name: true });
        } else if (!description) {
            setErrorMessage({ description: true });
        } else if (!price && price < 0) {
            setErrorMessage({ price: true });
        } else if (!category) {
            setErrorMessage({ category: true });
        } else if (!url) {
            setErrorMessage({ url: true });
        } else {
            setLoading(true);
            console.log("Before Api", prodData);
            updateProduct(prodData);
            history('/')
        }
    }
    const productDeleteSubmmitHandler = () => {
        setLoading(true)
      deleteProduct(deleteProdId) 
    }
    //    if (submitHandler) {
    //         setLoading(true)

    //    }
    // ** modal ends **


    // ** delete order modal starts here**
    const [activeMod, setActiveMod] = useState(false);

    const toggleModalDel = useCallback(() => setActiveMod((active) => !active) && setLoading(false), []);

    // if (activeMod) {
    // deleteProductModalDisplay()
    // }

    function deleteProductModalDisplay() {
        return (
            <div>
                <ModalActivator primaryActionContent='Delete Product' modalTitle="Confirm Delete Product"
                    containerContent={`By clicking "Delete Product" product will be deleted`}
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
    // ** delete order modal ends here**

    const rows2 = calculatedRows.map((item) => ([
        [
            <img src={
                item.image.src
            } />,
        ],
        [
            item.title,
        ],
        [
            `₹${item.variants[0].price
            }`,
        ],

        [
            <div onClick={
                () => getSingleProduct(item.id)
            }>
                <Button onClick={toggleModal}><EditMajor />
                </Button>
            </div>,

            // <EditMajor onClick={
            //     () => updateRedirect(item.id)
            // }/>,
        ],
        [

            <div style={
                {
                    width: "2rem",
                    cursor: "pointer"
                }
            }
                onClick={
                    () => getSingleProduct(item.id)
                }>
                <DeleteMajor onClick={toggleModalDel} />


            </div>,
            // <DeleteMajor onClick={
            //     () => deleteProduct(item.id)
            // }/>
        ],
    ]));
    console.log("Total pages:", totalPages);
    // const setCurrentPageNo = (e) => {
    //     setCurrentPage(e);
    //     // console.log(e);
    // };
    console.log("currentPage:", currentPage);
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
    console.log("currentPage", currentPage);

    const deleteProduct = async (id) => {
        const token = await getSessionToken(app);
        const config = {

            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false
            }

        }

        const { data } = await axios.delete(`/api/product/delete/${id}`, config)
       
        if (data.success === true) {
             getAllProducts()
             setActiveMod(false)
             setLoading(false) 
             setDeleteProdToast(true)
            //    console.log("CalulatedRows from function", calculatedRows);
        }
    }
    console.log("deleteProdId", deleteProdId);

    const getAllProducts = async () => {
        const token = await getSessionToken(app);
        console.log("token :- ", token);
        const config = {
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false
            }

        }

        const { data } = await axios.get('/api/products/all', config);

        console.log("result2 : ", data);
        setProducts(data)

    }
    if (currentPage > 1 && calculatedRows.length === 0) {
        setCurrentPage(currentPage - 1)
        console.log(currentPage);
    }

    useEffect(() => {

        getAllProducts();

    }, [])

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
                            content:  Loading === true ? <><Loader /></> :"Update Product",
                            onAction: submitHandler
                        }
                    }>
                    <Modal.Section> {
                        <>
                            <Stack vertical>
                                <Stack.Item> {
                                    singleProduct.id ? <>
                                        <FormLayout>
                                            <TextField label="Name" type="text"
                                                value={name}
                                                requiredIndicator={true}
                                                onChange={handleNameChange} />

                                            <InlineError message={
                                                errorMessage.name && "name is required"
                                            } />

                                            <TextField label="Description" type="text"
                                                value={description}
                                                requiredIndicator={true}
                                                onChange={handleDescriptionChange} />

                                            <InlineError message={
                                                errorMessage.description && "description is required"
                                            } />
                                            <TextField label="Price" type="number"
                                                value={price}
                                                requiredIndicator={true}
                                                onChange={handlePriceChange} />
                                            <InlineError message={
                                                errorMessage.price && "price is required"
                                            } />
                                            <TextField label="Category" type="text"
                                                value={category}
                                                requiredIndicator={true}
                                                onChange={handleCategoryChange} />
                                            <InlineError message={
                                                errorMessage.category && "category is required"
                                            } />
                                            <TextField label="Image" type="text"
                                                value={url}
                                                requiredIndicator={true}
                                                onChange={handleUrlChange} />
                                            <img style={
                                                {
                                                    width: "3rem",
                                                    height: "3rem"
                                                }
                                            }
                                                src={url}
                                                alt="Image Preview" />
                                            <InlineError message={
                                                errorMessage.url && "Image is required"
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
    return (
        <> {
            totalPages === currentPage ? <style>{cssNextEnable}</style> : <style>{cssNextDisable}</style>
        }
            {
                currentPage === 1 ? <style>{cssPrevDisable}</style> : <style>{cssPrevEnable}</style>
            }
            {
                !calculatedRows.length ? <>
                    <><Loader /></>
                </> : <div className="mx-5 my-auto">

                    <Card>
                        <Frame>
                            <DataTable columnContentTypes={
                                [
                                    "text",
                                    "text",
                                    "text",
                                    "text",
                                    "text"
                                ]
                            }
                                headings={
                                    [
                                        "",
                                        "Product",
                                        "Price",

                                        "Edit",
                                        "Delete"
                                    ]
                                }
                                rows={rows2}
                                footerContent={
                                    `Showing ${currentPage} of ${totalPages} results`
                                } />


                            <Toasting content="Product Updated Successfully"
                                active={activeToast}
                                toggledissmiss={toggleActive} />
                            <Toasting content="Product Deleted Successfully"
                                active={deleteProdToast}
                                toggledissmiss={toggleDelProdActive} />
                        </Frame>
                    </Card>

                    <div className="my-3 d-flex justify-content-center">
                        <div>

                            <Pagination hasPrevious
                                onPrevious={prevData}
                                hasNext
                                onNext={nextData} />
                        </div>
                    </div>
                </div>
            }

            {/* <div style={
                    {height: "500px"}
                }> */}
            {
                displayModal()
            }
            {
                deleteProductModalDisplay()
            }

            {/* </div> */} </>
    )
}

export default ProductTab
