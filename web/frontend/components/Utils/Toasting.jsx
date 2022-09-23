import { Toast, Frame, Page, Button } from "@shopify/polaris";
import { useState, useCallback } from "react";
const Toasting = (props) => {
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
  
    const toastMarkup = props.active ? (
      <Toast content={props.content} onDismiss={props.toggledissmiss} />
    ) : null;
  
  return (
    <>
    {/* <Frame> */}
      {/* <Page title="Toast example"> */}
        {/* <Button onClick={toggleActive}>Show Toast</Button> */}
        {toastMarkup}
      {/* </Page> */}
    {/* </Frame> */}
  </>
  )
}

export default Toasting