import React, {Component} from "react";
import Webcam from "react-webcam";
import { TextRecog } from "./TextRecog";

export default class OCR extends Component{

    constructor(props){
        super(props)
        this.webcamRef = React.createRef()
        this.state = {
            captureImage : null
        }
    }

    capturePhoto = () => {
        const image = this.webcamRef.current.getScreenshot()
        this.setState({captureImage : image})
        console.log(image);
    }

    photoScan = () => {
        TextRecog(this.state.captureImage)
    }

    render(){
        return(
            <div>
                <Webcam
                    ref={this.webcamRef}
                    audio={false}
                    height={720}
                    screenshotFormat="image/jpeg"
                    width={1280}
                />
                <button onClick={() => this.capturePhoto()}>Capture Photo</button>

                <img src={this.state.captureImage}/>
                <button onClick={() => this.photoScan()}>Scan Photo</button>
            </div>
        )
    }
}