import React, {Component} from "react";
import Webcam from "react-webcam";
import Resizer from "react-image-file-resizer";
import Tesseract from 'tesseract.js'
import { Row, Col, Card, CardHeader, CardBody, CardFooter, Button } from "reactstrap";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

export default class OCRCamera extends Component{

    constructor(props){
        super(props)
        this.webcamRef = React.createRef()
        this.state = {
            resizeImage : null,
            upscaleImage : null,
            resultText : null,
            faceMode : FACING_MODE_USER,
            typeDoc : "",
            frontResultText : null,
            backResultText : null,
            frontDocImg : null,
            backDocImg : null,
            arrText : []
        }
    }

    switchCamera = () => {
        this.setState({faceMode : this.state.faceMode !== FACING_MODE_USER ? FACING_MODE_USER : FACING_MODE_ENVIRONMENT})
    }

    capturePhoto = () => {
        const image = this.webcamRef.current.getScreenshot()
        console.log(this.state.typeDoc);
        this.imageResizer(image,this.state.typeDoc)
    }

    imageResizer = (image, type) => {
        const file = this.dataURLtoFile(image,"image.jpeg")
        Resizer.imageFileResizer(
            file,
            1280,
            720,
            "PNG",
            100,
            0,
            (uri) => {
                if (type === "front") {
                    this.setState({ frontDocImg: uri });
                }else{
                    this.setState({ backDocImg: uri });
                }
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

    textRecog = (image,type) => {
        Tesseract.recognize(
            image,
            'eng',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            console.log(text);
            const splitText = text.split(["\n"])
            console.log(splitText);
            if (type === "front") {
                this.setState({frontResultText : text})
            }else{
                this.setState({backResultText : text})
            }
            return text
        })
    }

    photoScan = () => {
        this.textRecog(this.state.frontDocImg,"front")
        this.textRecog(this.state.backDocImg,"back")
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
                                    <Row>
                                        <Col>
                                            <Webcam
                                                className="col-12"
                                                ref={this.webcamRef}
                                                audio={false}
                                                height={720}
                                                screenshotFormat="image/jpeg"
                                                screenshotQuality={1}
                                                forceScreenshotSourceSize={true}
                                                width={1280}
                                                videoConstraints={{
                                                    height:720,
                                                    width:1280,
                                                    facingMode: this.state.faceMode
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <span>Side Of Document : </span>
                                        </Col>
                                        <Col>
                                            <select className="form-control" onChange={e => this.setState({typeDoc : e.target.value})}>
                                                <option value="">--SELECT--</option>
                                                <option value="front">Front</option>
                                                <option value="back">Back</option>
                                            </select>
                                        </Col>
                                    </Row>
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

                    <Row className="my-4">
                        <Col xs="1"></Col>
                        <Col className="text-center" xs="10">
                            <Card>
                                <CardHeader>
                                    <h2>Result Picture</h2>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h4>Front Doc</h4>
                                            <img src={this.state.frontDocImg} className="img-fluid"/>
                                            {
                                                this.state.frontResultText !== null
                                                ?   <>
                                                        <h5>Result :</h5>
                                                        <p>{this.state.frontResultText}</p>
                                                    </>
                                                : <></>
                                            }
                                        </Col>
                                        <Col>
                                            <h4>Back Doc</h4>
                                            <img src={this.state.backDocImg} className="img-fluid"/>
                                            {
                                                this.state.backResultText !== null
                                                ?   <>
                                                        <h5>Result :</h5>
                                                        <p>{this.state.backResultText}</p>
                                                    </>
                                                : <></>
                                            }
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Row>
                                        <Col>
                                            <Button color="primary" onClick={() => this.photoScan()}>Scan Photo</Button>
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