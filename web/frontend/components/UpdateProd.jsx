import {useCallback, useEffect, useState} from "react";
import {

    TextField,
    Button,
    InlineError,
    Form,
    FormLayout
} from "@shopify/polaris";
import axios from 'axios'
import {useAppBridge} from "@shopify/app-bridge-react";
import {getSessionToken} from "@shopify/app-bridge-utils";
import {useNavigate} from "react-router-dom";
import Loader from "./Loader/Loader";
const UpdateProd = () => {
    const history = useNavigate();
    const getSingleProduct = async () => {
        const token = await getSessionToken(app);

        const config = {
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false
            }
        }

        const {data} = await axios.get(`/api/product/${url2}`, config)
        console.log(data)
        if (!data) {
            setSingleProduct(false)
        } else {
            setSingleProduct(true)
            
        }
        // setSingleProduct(data)
        setDesription(data.body_html)
        setName(data.handle)
        setCategory(data.product_type)
        setPrice(data.variants[0].price)
    }

    // const updateProd2 = () => {
    //     const
    // }

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
            body: JSON.stringify(prodData),
            // credentials: 'include'
        }
        const {data} = await axios.put(`/api/product/update/${url2}`, prodData, config)
        //    const data = await fetch(`/api/product/update/${url2}`,  {
        //     method:"PUT",
        //                 headers: {
        //                     Authorization: "Bearer " + token,
        //                     "ngrok-skip-browser-warning": false,
        //                     "Content-Type": "application/json",
        //                 },
        //                 body:JSON.stringify(prodData),
        //                 // credentials: 'include'
        //             }) 
        console.log("Updated Data", data);
        // .catch((error) => console.log(error))

    }
    let url = window.location.href.split("?").splice(0, 1)
    let url2 = url[0].slice(-13)
    // console.log(url2);

    const app = useAppBridge();
    const [singleProduct, setSingleProduct] = useState(false);

    const [description, setDesription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState({
        name: false,
        price: false,
        category: false,
        description: false,
        color: false
    })
// const prodLength = singleProduct.length;
// console.log("prodLength: " + prodLength);
    const handleDescriptionChange = useCallback((e) => setDesription(e))
    const handlePriceChange = useCallback((e) => setPrice(e))
    const handleCategoryChange = useCallback((e) => setCategory(e))
    const handleNameChange = useCallback((e) => setName(e))
    let prodData = {
        name,
        description,
        category,
        price
    }
    const submitHandler = async () => {

        if (!name) {
            setErrorMessage({name: true});
        } else if (!description) {
            setErrorMessage({description: true});
        } else if (!price && price < 0) {
            setErrorMessage({price: true});
        } else if (!category) {
            setErrorMessage({category: true});
        } else {

            console.log("Before Api", prodData);
            updateProduct(prodData);
            history('/')
        }
        // console.log("After Api", prodData);
    }
    useEffect(() => {
        getSingleProduct()

    }, [])
    return (<>
        <Form>

{ !singleProduct ? <>
                    <><Loader/></>
                </>:
                
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
                <Button primary
                    onClick={submitHandler}>Update Product</Button>
            </FormLayout>
                 }

           
        </Form>
    </>)
}

export default UpdateProd
