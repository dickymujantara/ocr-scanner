import React, {Component} from "react";
import Webcam from "react-webcam";
import Resizer from "react-image-file-resizer";
import Tesseract from 'tesseract.js';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, Button } from "reactstrap";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

export default class OCR extends Component{

    constructor(props){
        super(props)
        this.webcamRef = React.createRef()
        this.state = {
            resizeImage : null,
            resultText : null,
            faceMode : FACING_MODE_USER,
            arrText : []
        }
    }

    switchCamera = () => {
        this.setState({faceMode : this.state.faceMode !== FACING_MODE_USER ? FACING_MODE_USER : FACING_MODE_ENVIRONMENT})
    }

    capturePhoto = () => {
        const image = this.webcamRef.current.getScreenshot()
        this.imageResizer(image)
        console.log(image);
    }

    imageResizer = (image) => {
        const file = this.dataURLtoFile(image,"image.jpeg") 
        console.log(file);
        Resizer.imageFileResizer(
            file,
            1280,
            720,
            "JPEG",
            100,
            0,
            (uri) => {
              console.log(uri);
              this.setState({ resizeImage: uri });
            },
            "base64",
        );
    }

    dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

    textRecog = (image) => {
        Tesseract.recognize(
            image,
            'ind',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            console.log(text);
            const splitText = text.split(["\n"])
            console.log(splitText);
            this.setState({
                resultText : text,
                arrText : splitText
            })
            return text
        })
    }

    photoScan = () => {
        this.textRecog(this.state.resizeImage)
    }

    render(){
        return(
            <Row>
                <Col xs="12">
                    <Row>
                        <Col xs="1"></Col>
                        <Col className="text-center" xs="10">
                            <Card>
                                <CardHeader>
                                    <h2>Take Picture</h2>
                                </CardHeader>
                                <CardBody>
                                    <Webcam
                                        ref={this.webcamRef}
                                        audio={false}
                                        height={720}
                                        screenshotFormat="image/jpeg"
                                        width={1280}
                                        videoConstraints={{
                                            facingMode: this.state.faceMode
                                        }}
                                    />
                                </CardBody>
                                <CardFooter>
                                    <Row>
                                        <Col>
                                            <Button className="mx-2" color="primary" onClick={() => this.switchCamera()}>Switch Camera</Button>
                                            <Button color="primary" onClick={() => this.capturePhoto()}>Capture Photo</Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col xs="1"></Col>
                    </Row>
                </Col>
                
                <Col className="mt-3" xs="12">
                    <Row>
                        <Col xs="1"></Col>
                        <Col className="text-center" xs="10">
                            <Card>
                                <CardHeader>
                                    <h2>Result Image</h2>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <img src={this.state.resizeImage}/>
                                        </Col>
                                    </Row>
                                    {
                                        this.state.arrText.length > 0 
                                        ? <Row>
                                            <Col>
                                                <h6>Raw Text</h6>
                                                <span>{this.state.resultText}</span>
                                                <h6>Convert to Array:</h6>
                                                {
                                                    this.state.arrText.map(e => {
                                                        return(
                                                            <p>{e}</p>
                                                        )
                                                    })
                                                }
                                            </Col>
                                        </Row>
                                        : <></>
                                    }
                                </CardBody>
                                <CardFooter>
                                    <Row>
                                        <Col>
                                            <Button className="mx-2" color="primary" onClick={() => this.photoScan()}>Scan Photo</Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col xs="1"></Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}