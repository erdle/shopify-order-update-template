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
    InlineError,Popover,ActionList,
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

const ProductGQL = () => {

    const app = useAppBridge();
    const history = useNavigate();

    const [products, setProducts] = useState([]);
    const [getId, setGetId] = useState(0);
    const [Loading, setLoading] = useState(false)
    const [deleteProdId, setDeleteProdId] = useState(0)
    const [deleteProdToast, setDeleteProdToast] = useState(false)
    const [active, setActive] = useState(false);
    const toggleModal = useCallback(() => setActive((active) => !active), []);
    // if (Loading === true) {
    //     return (<><Loader/></>)
    // }
    // **Pagination starts **
    const [singleProduct, setSingleProduct] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10
    const count = products.length
    const totalPages = Math.ceil(count / rowsPerPage)
    console.log("Total pages: " + totalPages);
    const calculatedRows = products.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    console.log("calculatedRows", calculatedRows);


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
    const handleDescriptionChange = useCallback((e) => setDesription(e))
    const handlePriceChange = useCallback((e) => setPrice(e))
    const handleCategoryChange = useCallback((e) => setCategory(e))
    const handleNameChange = useCallback((e) => setName(e))
    const handleUrlChange = useCallback((e) => setUrl(e))
    const [activeToast, setActiveToast] = useState(false);
    const [activeMod, setActiveMod] = useState(false);
    const toggleActive = useCallback(() => setActiveToast((activeToast) => !activeToast), []);
    const toggleModalDel = useCallback(() => setActiveMod((active) => !active) && setLoading(false), []);
    const toggleDelProdActive = useCallback(() => setDeleteProdToast((activeToast) => !activeToast), []);

    // searching data starts

    const [searchField, setSearchField] = useState(null);
    if(searchField === "" ){
        setSearchField(null)
    }
    const handleSearchFieldChange = useCallback(
        (value) => {
            setSearchField(value)
            setFirstNumProd("$numProds")
            setLastNumProd(null)
            setBackwardCursor(null)
        },
        [],
        );
        
    // searching data ends


        //Pagination starts here


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
    if(prevPage === false){
        setBackwardCursor(null)
    }
}
const nextData = () => {
    // setCurrentPage(currentPage + 1)
    setLastNumProd(null)
    setFirstNumProd("$numProds")
    setForwardCursor(forwardCursorString)
    setBackwardCursor(null) 
    if(nextPage === false){
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
//Pagination ends here




    //Category popover starts here


    const [searchCategory, setSearchCategory]  = useState(null)
const [categoryPopoverActive, setCategoryPopoverActive] = useState(false);


const CategoryPopoverToggleActive = useCallback(() => setCategoryPopoverActive((active) => !active), []);

const handleCategoryNoneAction = useCallback(() =>{
    console.log('None action');
    setReverseValue(false)
    setSearchCategory(null)
}, [])
const handleCategoryTITTLEAction = useCallback(() =>{
    console.log('None action');
    setReverseValue(false)
    setSearchCategory("TITLE")
}, [])
const handleCategoryPRODUCT_TYPEAction = useCallback(() =>{
    console.log('None action');
    setReverseValue(false)
    setSearchCategory("PRODUCT_TYPE")
}, [])
const handleCategoryCREATED_ATAction = useCallback(() =>{
    console.log('None action');
    setReverseValue(false)
    setSearchCategory("CREATED_AT")
}, [])



const CategoryPopoverActivator = (
  <Button onClick={CategoryPopoverToggleActive} disclosure>
   Category
  </Button>
);
//Category popover ends here

    //Sorting popover starts here
const [reverseValue, setReverseValue] = useState(false)
    const [popoverActive, setPopoverActive] = useState(false);

    const popoverToggleActive = useCallback(() => setPopoverActive((active) => !active), []);
  
    const handleAZAction = useCallback(
      () => {
        console.log('Imported action');
        setSearchCategory("TITLE")
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
        setSearchCategory("TITLE")
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


    const rows2 = calculatedRows.map((item) => ([
        [
            <img src={
                item.node.images.nodes[0].src
            } />,
        ],
        [
            item.node.title,
        ],
        [
            `${item.node.variants.nodes[0].price}`
            // }`,
        ],

        [
            <div onClick={
                () => getSingleProdGql(item.node.id)
            }>
                <Button onClick={toggleModal}><EditMajor />
                </Button>
            </div>,

            // <EditMajor onClick={
            //     () => getSingleProdGql(item.node.id)
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
                    // () => getSingleProduct(item.id)
                    () => setDeleteProdId(item.node.id)
                }>
                <DeleteMajor onClick={toggleModalDel} />


            </div>,
            // <DeleteMajor onClick={
            //     () => deleteProduct(item.id)
            // }/>
        ],
    ]));
    const productDeleteSubmmitHandler = () => {
        setLoading(true)
        deleteSingleProdGql(deleteProdId)
    }

    const deleteSingleProdGql = async (deleteProdId) => {
        const token = await getSessionToken(app);
        console.log("updateProdGql token :- ", token);
        try {
            const id = deleteProdId.split("/").splice(-1)
            console.log("Deleting ID", id);
            const config = {

                headers: {
                    Authorization: "Bearer " + token,
                    "ngrok-skip-browser-warning": false
                }
            }

            const { data } = await axios.get(`/api/graphql/delete/${id}`, config);
            if (data.success === true) {
                getAllProdsWithQuery()
                setActiveMod(false)
                setLoading(false)
                setDeleteProdToast(true)
                //    console.log("CalulatedRows from function", calculatedRows);
            }
            console.log("Prod Deleted", data);
        } catch (error) {
            console.log(error);
        }

    }
    const getSingleProdGql = async (SingleProdID) => {
        const id = SingleProdID.split('/').splice(-1)
        const token = await getSessionToken(app);
        console.log("updateProdGql token :- ", token);
        try {
            const config = {

                headers: {
                    Authorization: "Bearer " + token,
                    "ngrok-skip-browser-warning": false,
                    'Content-Type': ['application/json', 'application/graphql']
                },
                // body: JSON.stringify(id)
            }

            const { data } = await axios.get(`/api/graphql2/${id}`, config);
            const SingleProduct = data.product.body.data.product
            console.log("Single Prod", SingleProduct);
            setLoading(false)
            setSingleProduct(SingleProduct)
            setGetId(id)
            setDesription(SingleProduct.bodyHtml)
            setName(SingleProduct.title)
            setCategory(SingleProduct.productType)
            setPrice(SingleProduct.variants.nodes[0].price)
            setUrl(SingleProduct.images.nodes[0].src)
        } catch (error) {
            console.log(error);
        }

    }

    const filterValues = {
        reverseValue,searchCategory, forwardCursor, backwardCursor, nextPage, prevPage, firstNumProd, lastNumProd
    }
    const getAllProdsWithQuery = async (filterValues) => {
        const token = await getSessionToken(app);
        console.log("getAllProdsWithQuery token :- ", token);

        const config = {

            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filterValues),
        }
        try {
            const { data } = await axios.post(`/api/graphql/new/${searchField}`,filterValues, config);
            console.log("Result", data);
            console.log("Products with query", data.product.body.data.products.edges);
            console.log("Cursor", data.product.body.data.products.pageInfo);
            setProducts(data.product.body.data.products.edges)
            setForwardCursorString(data.product.body.data.products.pageInfo.endCursor)
            setBackwardCursorString(data.product.body.data.products.pageInfo.startCursor)
             setPrevPage(data.product.body.data.products.pageInfo.hasPreviousPage)
             setNextPage(data.product.body.data.products.pageInfo.hasNextPage)
        } catch (error) {
            console.log(error);
        }
    }
    console.log(forwardCursor);
    let prodData = {
        name,
        description,
        category,
        price,
        url
    }
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
            updateProdGql(prodData);
            history('/')
        }
    }
    const updateProdGql = async (prodData) => {
        const token = await getSessionToken(app);
        console.log("updateProdGql token :- ", token);
        const config = {

            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prodData)

        }
        console.log("prodData", prodData);
        try {
            const { data } = await axios.put(`/api/graphql/update/${getId}`, prodData, config);
            //  console.log(prodData);
            if (data.success === true) {
                getAllProdsWithQuery()
                toggleModal()
                setActiveToast(true)
                // setLoading(false)
            }
            console.log("Updated Prod", data);
        } catch (error) {
            console.log(error);
        }


    }
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
                            content: Loading === true ? <><Loader /></> : "Update Product",
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
    console.log("Products with query", products);


    useEffect(() => {
        getAllProdsWithQuery(filterValues);
    }, [searchField, reverseValue, searchCategory, forwardCursor, backwardCursor])
    return (
        <>
        {
            nextPage !== true ? <style>{cssNextEnable}</style> : <style>{cssNextDisable}</style>
        }
           {
                prevPage !== true ? <style>{cssPrevDisable}</style> : <style>{cssPrevEnable}</style>
            }
          
    <TextField
                              
                              value={searchField}
                              onChange={handleSearchFieldChange}
                              placeholder="Example: North America, Europe"
                              autoComplete="off"
                          />


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
<Popover
        active={categoryPopoverActive}
        activator={CategoryPopoverActivator}
        autofocusTarget="first-node"
        onClose={CategoryPopoverToggleActive}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            {
              content: 'None',
              onAction: handleCategoryNoneAction,
            },
            {
              content: 'Title',
              onAction: handleCategoryTITTLEAction,
            },
            {
              content: 'Product Type',
              onAction: handleCategoryPRODUCT_TYPEAction,
            },
            {
              content: 'New Arrivals',
              onAction: handleCategoryCREATED_ATAction,
            },
        
          ]}
        />
      </Popover>

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
                    <div className="my-3 d-flex justify-content-center">
                        <div>

                            <Pagination hasPrevious
                                onPrevious={prevData}
                                hasNext
                                onNext={nextData} />
                        </div>
                    </div>
                        </Frame>
                    </Card>

                </div>
            }
            {deleteProductModalDisplay()}
            {displayModal()}
            {/* {products.id} */}
        </>
    )
}

export default ProductGQL