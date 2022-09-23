import {useAppBridge} from "@shopify/app-bridge-react"
import {getSessionToken} from "@shopify/app-bridge-utils"
import {useCallback, useEffect, useState} from "react"
import axios from 'axios'
import {Button, FormLayout, InlineError, TextField} from "@shopify/polaris"
import {useNavigate} from "react-router-dom"
import Loader from "./Loader/Loader"

const UpdateOrder = () => {

    const app = useAppBridge()
    const history = useNavigate();
    let url = window.location.href.split('?').splice(0, 1)
    let url2 = url[0].slice(-13)
    const updateOrder = async (orderData) => {
        const token = await getSessionToken(app);

        const config = {
            headers: {
                Authorization: "Bearer " + token,
                "ngrok-skip-browser-warning": false
            },
            body: JSON.stringify(orderData)
        }
        const {data} = await axios.put(`/api/order/update/${url2}`, orderData, config)

        console.log(data);
        history('/')
    }
    const [singleOrder, setSingleOrder] = useState([])
    const [notes, setNotes] = useState("");
    const [phone, setPhone] = useState(null);
    const [mail, setMail] = useState("");
    const [errorMessage, setErrorMessage] = useState({mail: false, phone: false, note: false});

    const handleNotesChange = useCallback((e) => setNotes(e))
    const handleMailChange = useCallback((e) => setMail(e))
    const handlePhoneChange = useCallback((e) => setPhone(e))

    const getSingleOrder = async () => {
        const token = await getSessionToken(app);

        const config = {
            headers: {
                Authorization: 'Bearer ' + token

            }
        }


        console.log(url2);

        const {data} = await axios.get(`/api/order/${url2}`, config)

        // setSingleOrder(data)
        console.log(data);
        setSingleOrder(data)
        setPhone(data.phone)
        setNotes(data.note)
        setMail(data.email)

    }

    const orderData = {
        email: mail,
        phone,
        note: notes
    }
    const orderSubmitHandler = () => {

        if (!mail) {
            setErrorMessage({mail: true});
        } else if (!notes) {
            setErrorMessage({note: true});
        } else if (!phone) {
            setErrorMessage({phone: true});
        } else {

            updateOrder(orderData)
        }
    }

    useEffect(() => {
        getSingleOrder()
    }, [])
    return (
        <> {
            !singleOrder ? 
                <><Loader/></>
             : 
                <>
                    <FormLayout>
                        <TextField type="email" label="Order's email"
                            value={mail}
                            onChange={handleMailChange}
                            autoComplete="email"/>
                        <InlineError message={
                            errorMessage.mail && "mail is required"
                        }/>
                        <TextField label="Notes"
                            value={notes}
                            onChange={handleNotesChange}/>
                        <InlineError message={
                            errorMessage.note && "Note is required"
                        }/>
                        <TextField label="Phone Number"
                            value={phone}
                            onChange={handlePhoneChange}/>
                        <InlineError message={
                            errorMessage.phone && "Phone is required"
                        }/>

                        <Button onClick={orderSubmitHandler}
                            primary>Update Order Details</Button>
                    </FormLayout>
                </>
            
        } </>
    )
}

export default UpdateOrder
