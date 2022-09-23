import {Button, Card, Page} from "@shopify/polaris";

import {MobileBackArrowMajor} from '@shopify/polaris-icons';
import {useNavigate} from "react-router-dom";
import Tab from "../components/TabsMain/Tabs";
export default function HomePage() {
    const history = useNavigate()
    return (
        <Page fullWidth>
            {/* <Card> */}
                {/* <div className="m-2">

                    <Button onClick={
                        () => history(-1)
                    }>
                        {
                        < MobileBackArrowMajor />
                    }</Button>
                </div> */}
                <Tab/>
            {/* </Card> */}
        </Page>
    );
}
