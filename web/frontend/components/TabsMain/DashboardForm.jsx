import {useAppBridge} from '@shopify/app-bridge-react';
import {getSessionToken} from '@shopify/app-bridge-utils';
import {
    Heading,
    Card,
    Form,
    FormLayout,
    TextField,
    Button,
    TextContainer,
    ColorPicker,
    Toast,
    hsbToHex,
    Frame,
    InlineError,
    Popover,
    ActionList


} from '@shopify/polaris'
import axios from 'axios';

import {useState, useCallback, useEffect} from 'react'
import Loader from '../Loader/Loader';
import Toasting from '../Utils/Toasting';
function DashboardForm() {

    const app = useAppBridge();
    const [Loading, setLoading] = useState(false)
    const [name, setName] = useState('');
    const [description, setDesription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [url, setUrl] = useState('');
    const [stocks, setStocks] = useState(0);
    const [color, setColor] = useState({hue: 210, saturation: 1, brightness: 1});
    const [errorMessage, setErrorMessage] = useState({
        name: false,
        price: false,
        category: false,
        description: false,
        stocks: false,
        url: false,
        color: false
    })

    const [active, setActive] = useState(false);

    const [CreateProdToast, setCreateProdToast] = useState(false)
    const toggleActive = useCallback(() => setActive((active) => !active), []);


    const toggleCreateProdActive = useCallback(() => setCreateProdToast((activeToast) => !activeToast), []);
    const notSelected = !name || !description || !price || !category;
    const handleDescriptionChange = useCallback((e) => setDesription(e))
    const handlePriceChange = useCallback((e) => setPrice(e))
    const handleCategoryChange = useCallback((e) => setCategory(e))
    const handleUrlChange = useCallback((e) => setUrl(e))
    const handleStocksChange = useCallback((e) => setStocks(e))

    const getProdGQL = async () => {
        const token = await getSessionToken(app);
        console.log("token :- ", token);
        const config = {

            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                "Content-Type": ["application/json", "application/graphql"]
            }

        }

        const {data} = await axios.get('/api/graphql', config);
        console.log("All Products", data);
        console.log("Products", data.products.body.data.products.edges);

    }


    const deleteSingleProdGql = async () => {
        const token = await getSessionToken(app);
        console.log("updateProdGql token :- ", token);
        try {
            const id = "7735619551363"
            const config = {

                headers: {
                    Authorization: "Bearer " + token,
                    "ngrok-skip-browser-warning": false
                }
            }

            const {data} = await axios.get(`/api/graphql/delete/${id}`, config);

            console.log("Prod Deleted", data);
        } catch (error) {
            console.log(error);
        }

    }
    const getSingleProdGql = async () => {
        const id = "7735619387523"
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

            const {data} = await axios.get(`/api/graphql2/${id}`, config);

            console.log("Single Prod", data);
        } catch (error) {
            console.log(error);
        }

    }
    const updateProdGql = async () => {
        const token = await getSessionToken(app);
        console.log("updateProdGql token :- ", token);
        const config = {

            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                'Content-Type': ['application/json', 'application/graphql']
            }

        }
const updateData = "Newly Updated"
        const {data} = await axios.get(`/api/graphql/update/${updateData}`, config);
        console.log("Updated Prod", data);

    }

    // API with params as query and mutations starts
    const getAllProdsWithQuery = async () => {
        const token = await getSessionToken(app);
        console.log("getAllProdsWithQuery token :- ", token);
        const getQuery=``
        const config = {
            
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                "Content-Type": ["application/json", "application/graphql"]
            },
        method: "GET",
        url:`/api/graphql/new`,
    
        }
        const {data} = await axios(config)
        try {
            console.log("getAllProdsWithQuery", data);
            
        } catch (error) {
            console.log(error);
        }
    }
    const updateProdWithMutation = async () => {

        const token = await getSessionToken(app);
        const updateMutation = `mutation{
        productUpdate(input:{id:"gid://shopify/Product/7735614537859", title: "Newly Updated"}){
product{
    id
title
}
        }
    }`
        const config = {
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                "Content-Type": ["application/json", "application/graphql"]
            }
        }
        const {data} = await axios.get(`/api/mutation/graphql/${updateMutation}`, config)
        console.log(data);
    }
    const createProductWithMutation = async () => {
        const token = await getSessionToken(app);
        const create = `title: "New Product Created", productType: "Snowboard", vendor: "JadedPixel"`
        const config = {
            headers:{
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning":false,
                "Content-Type": ["application/json", "application/graphql"]
            }
        }
        const {data} = await axios.get(`/api/graphql/create/${create}`, config)
    console.log(data);
    }
    const getSingleProdsWithQuery = async () => {
        const token = await getSessionToken(app);
        console.log("getAllProdsWithQuery token :- ", token);

        const getSingleProd = `{
        product(id: "gid://shopify/Product/7735619387523") {
          title
        }
      }`
        const config = {
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                "Content-Type": ["application/json", "application/graphql"]
            }

        }

        const {data} = await axios.get(`/api/graphql/${getSingleProd}`, config)
        console.log("getSingleProdsWithQuery", data);
    }

    // API with params as query and mutations ends
    const createProduct = async (prodData) => {
        setLoading(true)
        const token = await getSessionToken(app);
        console.log("token :- ", token);

        const config = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false,
                "Content-Type": "application/json"
            }

        }


        const {data} = await axios.post(`/api/product/create`, prodData, config)
        if (data.success === true) {
            setName("");
            setUrl("");
            setPrice(0);
            setCategory("");
            setColor({hue: 210, saturation: 1, brightness: 1});
            setStocks(0)
            setCreateProdToast(true)
            setLoading(false)
        }
        console.log("Updated Data", data);
        // .catch((error) => console.log(error))

    }

    const hexColor = hsbToHex(color);
    const createProductData = {
        name,
        price,
        category,
        description,
        url,
        hexColor
    }
    const submitHandler = () => {
        if (!name) {
            setErrorMessage({name: true});
        } else if (!description) {
            setErrorMessage({description: true});
        } else if (!price) {
            setErrorMessage({price: true});
        } else if (!category) {
            setErrorMessage({category: true});
        } else if (!color) {
            setErrorMessage({color: true});
        } else if (!url) {

            setErrorMessage({url: true});
        } else {
            createProduct(createProductData)
        }

    }

    const css = `

    .Polaris-Button--fullWidth {
        border:0px !important;
        padding:0 !important;
        width: 3rem !important;
        margin-right: 0.5rem !important;
        height: 3rem !important;
    }

    .Polaris-Button--fullWidth > .Polaris-Button__Content {
        background-color: ${hexColor} !important;
        color: white !important;
        padding:20px 20px !important;
        border-radius:4px !important;
    }
`
    const activator = (<>
        <div className='d-flex align-items-center'>

            <Button onClick={toggleActive}
                fullWidth></Button>
            {hexColor} </div>
    </>);
    const handleNameChange = useCallback((e) => {
        setName(e)
    })
    useEffect(() => {
        // getProdGQL()
        // updateProdGql()
        getSingleProdGql()
        // deleteSingleProdGql()
        // createProductWithMutation()

        getAllProdsWithQuery()
        // getSingleProdsWithQuery()
        // updateProdWithMutation()
    }, [])
    return (<>

        <style> {css}</style>
        {/* <Frame> */}

        <div className=" w-50 container d-flex flex-column justify-content-between">
            <div className=" card1">
                <Frame>
                    <Card sectioned>
                        <div className="text-center mb-3 mx-3">
                            <Heading>Create Product</Heading>
                        </div>

                        <Form>
                            <FormLayout>
                                <TextField label="Name" type="text"
                                    value={name}
                                    requiredIndicator={true}
                                    onChange={handleNameChange}/>
                                <InlineError message={
                                    errorMessage.name && "name is required"
                                }/>
                                <TextField label="Description" type="text"
                                    value={description}
                                    requiredIndicator={true}
                                    onChange={handleDescriptionChange}/>

                                <InlineError message={
                                    errorMessage.description && "description is required"
                                }/>


                                <TextField label="Price" type="number"
                                    value={price}
                                    requiredIndicator={true}
                                    onChange={handlePriceChange}/>
                                <InlineError message={
                                    errorMessage.price && "price is required"
                                }/>


                                <TextField label="Category" type="text"
                                    value={category}
                                    requiredIndicator={true}
                                    onChange={handleCategoryChange}/>
                                <InlineError message={
                                    errorMessage.category && "category is required"
                                }/>
                                <TextField label="Image" type="text"
                                    value={url}
                                    requiredIndicator={true}
                                    onChange={handleUrlChange}/>
                                <InlineError message={
                                    errorMessage.url && "Image is required"
                                }/>
                                <img src={url}
                                    alt="Image Preview"
                                    style={
                                        {
                                            width: "3rem",
                                            height: "3rem"
                                        }
                                    }/>

                                <p>Product Color</p>
                                <div className="colorBox">
                                    <Popover fullWidth fullHeight
                                        active={active}
                                        activator={activator}
                                        // autofocusTarget="first-node"
                                        onClose={toggleActive}>
                                        <ColorPicker allowAlpha={false}
                                            requiredIndicator={true}
                                            onChange={setColor}
                                            color={color}/>
                                    </Popover>
                                </div>
                                <InlineError message={
                                    errorMessage.color && "color is required"
                                }/>
                                <Button primary
                                    onClick={
                                        () => {
                                            submitHandler()
                                        }
                                }> {
                                    Loading === true ? <><Loader/></> : "Create Product"
                                }</Button>

                            </FormLayout>
                        </Form>


                        <Toasting content="Product Created Successfully"
                            active={CreateProdToast}
                            toggledissmiss={toggleCreateProdActive}/>
                    </Card>
                </Frame>

            </div>
        </div>

        {/* </Frame> */} </>)
}


export default DashboardForm
