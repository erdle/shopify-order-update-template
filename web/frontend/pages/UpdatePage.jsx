import {Card, Page, Layout, Button} from "@shopify/polaris";
import {MobileBackArrowMajor} from '@shopify/polaris-icons';
import {useNavigate} from "react-router-dom";
import UpdateProd from "../components/UpdateProd";
const UpdatePage = () => {

    const history = useNavigate()

    return (
        <>
            <Page>
                <Button onClick={
                    () => history(-1)
                }>
                    {
                    < MobileBackArrowMajor />
                }</Button>
                <Layout>
                    <Layout.Section>
                        <Card sectioned>
                            <UpdateProd/>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </>
    )
}

export default UpdatePage
