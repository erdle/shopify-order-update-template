import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ActionList, Button, Card, Form, FormLayout, Frame, Popover, TextField } from "@shopify/polaris";
import '../../Styles/table.css'
import Toasting from "../Utils/Toasting";
import '../../Styles/previewEmbed.css'

const Widgit = () => {
  const app = useAppBridge();

  const [widgits, setWidgit] = useState();
  const [positionValue, setPositionValue] = useState("bottom-left");
  const [image, setImage] = useState("");
  const [dissmissToast, setDissmissToast] = useState(false)
  const [active, setActive] = useState(false);


  console.log("Widgit:", widgits);
  const handleImageChange = useCallback((e) => { setImage(e) }, [])
  const toggleActivePosition = useCallback(() => setActive((active) => !active), []);
  const toggleDissmissToast = useCallback(() => setDissmissToast((activeToast) => !activeToast), []);
  const handleTopLeftAction = useCallback(
    () => setPositionValue("top-left"),
    [],
  );

  const handleBottomLeftAction = useCallback(
    () => setPositionValue("bottom-left"),
    [],
  );
  const handleTopRightAction = useCallback(
    () => {
      setPositionValue("top-right");
      toggleActivePosition
    },
    [],
  );
  const handleBottomRightAction = useCallback(
    () => { setPositionValue("bottom-right"); toggleActivePosition },
    [],
  );

  const activator = (
    <Button onClick={toggleActivePosition} disclosure>
      {positionValue}
    </Button>
  );
  const createWidgit = async () => {
    const send = { demo: "Hello" }
    const token = await getSessionToken(app);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + token,

      }, body: JSON.stringify(send)
    }
    const data = await axios.post(`/api/widgit`, config);
    console.log("Widgit", data);
  }
  const getWidgits = async () => {

    // const token = await getSessionToken(app);
    const config = {
      headers: {
        // Authorization: 'Bearer ' + token,

      }
    }
    const { data } = await axios.get(`/api/widgit`, config);
    console.log("Widgit", data);
    setWidgit(data.data);
  }
  const updateWidgit = async () => {
    const updateWid = {
      position: positionValue, imageUrl: image
    }
    // const token = await getSessionToken(app);
    const config = {
      headers: {
        // Authorization: 'Bearer ' + token,
        "ngrok-skip-browser-warning": true,
      },
      data: updateWid
    }
    const { data } = await axios.put(`/api/widgit/630883b30f772ccae56e30f6`, config);
    console.log("Widgit", data);
    if (data.success === true) {
      setDissmissToast(true)
    }

  }
  const getOneWidgit = async () => {
    const config = {
      headers: {
        "ngrok-skip-browser-warning": true,
      }
    }
    const { data } = await axios.get('/api/widgit/630883b30f772ccae56e30f6', config);
    const OneWidgit = data.data
    console.log("One Widgit", data.data);
    setPositionValue(OneWidgit.position);
    setImage(OneWidgit.imageUrl);
  }
    const bottomLeftPrevStyle = `
    .box{
      height: 100%;
      float:left;
      border: 0px solid rgb(255, 0, 0);
  
  }
  .fix{
     /* margin-top: ; */
      position:fixed;
      height:100px;
      bottom: 30px;
      /* background-color: aqua; */
  }
    `
    const bottomRightPrevStyle = `
    .box{
      height: 100%;
      float:right;
      border: 0px solid rgb(255, 0, 0);
  
  }
  .fix{
     /* margin-top: ; */
      position:fixed;
      height:100px;
      bottom: 30px;
      /* background-color: aqua; */
  }
    `
    const topLeftPrevStyle = `
    .box{
      height: 100%;
      float:left;
      border: 0px solid rgb(255, 0, 0);
  
  }
  .fix{
     /* margin-top: ; */
      position:fixed;
      height:100px;
      // bottom: 30px;
      /* background-color: aqua; */
  }
    `
    const topRightPrevStyle = `
    .box{
      height: 100%;
      float:right;
      border: 0px solid rgb(255, 0, 0);
  
  }
  .fix{
     /* margin-top: ; */
      position:fixed;
      height:100px;
      // bottom: 30px;
      /* background-color: aqua; */
  }
    `
  

  const widAppStyle = {
    position:'relative',
    
  }

  const styleTag = `
  #WidgitImage {
    width: 100px !important;
    height: 100px !important;
  }
  .preview{
    width: 100%;
    min-height: 100%;
    box-sizing: border-box !important;
    // -webkit-transform: translateZ(0);
  }
  
 
  
  `;
  useEffect(() => {
    // getWidgits();
    getOneWidgit();
  }, [])
  return (
    <>
      <style>{styleTag}</style>
      <style>{positionValue === "bottom-left" && bottomLeftPrevStyle}</style>
      <style>{positionValue === "bottom-right" && bottomRightPrevStyle}</style>
      <style>{positionValue === "top-left" && topLeftPrevStyle}</style>
      <style>{positionValue === "top-right" && topRightPrevStyle}</style>
      <div className="d-flex">
        <div className='w-25'>
          <Card>
            <Frame>
              <div className="m-5">
                <h1>Update App Embed</h1>
                <Form>
                  <FormLayout>
                    <Popover
                      active={active}
                      activator={activator}
                      onClose={toggleActivePosition}
                    >
                      <ActionList
                        actionRole="menuitem"
                        items={[
                          {
                            content: 'Top-Left',
                            onAction: handleTopLeftAction,
                          },
                          {
                            content: 'Bottom-Left',
                            onAction: handleBottomLeftAction,
                          },
                          {
                            content: 'Top-Right',
                            onAction: handleTopRightAction,
                          },
                          {
                            content: 'Bottom-Right',
                            onAction: handleBottomRightAction,
                          },

                        ]}
                      />
                    </Popover>

                    <TextField label="Image Url" type="text" onChange={handleImageChange} value={image} />

                    <p>Image Preview</p>
                    <div  >
                      <img className="updateAppEmbedImage" src={image} alt="Preview" />
                    </div>
                    <Button onClick={() => updateWidgit()} >Update App Embed </Button>
                  </FormLayout>
                </Form>
              </div>
              <Toasting content="App Embed Updated" active={dissmissToast} toggledissmiss={toggleDissmissToast} />
            </Frame>
          </Card>
        </div>
        <div className="preview cont clearfix border w-100 ">
          <div style={widAppStyle} class="WidgitApp box" id="WidgitApp" >
          <div className="">
            <div className="box">
              <div className="fix "></div>
            </div>
          </div>
            <div  className="fix" >

              <img id="WidgitImage" src={image} alt="WidgitImage" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Widgit