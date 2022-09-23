
import {Card, Layout, Page,Button} from "@shopify/polaris"
import UpdateOrder from "../components/UpdateOrder"
import {MobileBackArrowMajor} from '@shopify/polaris-icons';
import {useNavigate} from "react-router-dom";
const UpdateOrderPage = () => {

const history = useNavigate()
    return (
        <>
            <Page>
            {/* <Button onClick={
                () => history(-1)
            }>
                {
                < MobileBackArrowMajor />
            }</Button> */}
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <UpdateOrder/>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </>
    )
}

export default UpdateOrderPage
