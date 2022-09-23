import {
    Button,
    Modal,
    Stack,
    TextContainer,
    
  } from "@shopify/polaris";
  import { useState, useCallback, useRef } from "react";
  
import {DeleteMajor, EditMajor} from '@shopify/polaris-icons';
import Loader from "../Loader/Loader";

const ModalActivator = (props) => {

    const [active, setActive] = useState(false);
  
    const toggleModal = useCallback(() => setActive((active) => !active), []);
  
    const activator = <DeleteMajor style={{width:"2rem", height:"2rem", cursor: "pointer"}} onClick={props.openDelModal}/>;
  
  return (
    <>
     <div >
      <Modal
        activator={props.activateModal}
        open={props.openModal}
        onClose={props.closeModal}
        title={props.modalTitle}
        primaryAction={{
          content: props.load === true ? <><Loader/></> : props.primaryActionContent,
          onAction: props.primaryActionOnAction ,
        }}
        secondaryActions={
       {     content:props.secondaryActionsContent,
       onAction: props.closeModal
       }

        }
      >
        <Modal.Section>
         <Stack vertical>
            <Stack.Item>
              <TextContainer>
                <p>
               {props.containerContent}
                </p>
              </TextContainer>
            </Stack.Item>
           
          </Stack>
        
         
        </Modal.Section>
      </Modal>
    </div>
    </>
  )
}

export default ModalActivator