import {Spinner} from "@shopify/polaris"

const Loader = () => {
    return (
        <>
        <div className="d-flex justify-content-center align-items-center">

            <div  >
                {/* <Frame> */}
                    <Spinner accessibilityLabel="Spinner example" size="large"/>
                {/* </Frame> */}
            </div>
        </div>
        </>
    )
}

export default Loader
