import React, {Component} from "react";
import Resizer from "react-image-file-resizer";
import Tesseract from 'tesseract.js'
import { Row, Col, Card, CardHeader, CardBody, Button } from "reactstrap";

export default class OCR extends Component{

    constructor(props){
        super(props)
        this.webcamRef = React.createRef()
        this.state = {
            frontResultText : null,
            backResultText : null,
            frontDocImg : null,
            backDocImg : null,
        }
    }

    uploadPhoto = (image,type) => {
        Resizer.imageFileResizer(
            image,
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
            },
            "base64",
        );
    }

    scanDoc = () => {
        this.textRecog(this.state.frontDocImg,"front")
        this.textRecog(this.state.backDocImg,"back")
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

    render(){
        return(
            <Row>
                <Col xs="12">
                    <Row>
                        <Col xs="1"></Col>
                        <Col xs="10">
                            <Card>
                                <CardHeader className="text-center">
                                    {/* <h2>Take Picture</h2> */}
                                    <h2>Upload Document</h2>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h4>Front Doc</h4>
                                            <img src={this.state.frontDocImg} className="img-fluid"/>
                                            <input type="file" className="form-control mt-2" onChange={e => this.uploadPhoto(e.target.files[0],"front")}/>
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
                                            <input type="file" className="form-control mt-2" onChange={e => this.uploadPhoto(e.target.files[0],"back")}/>
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
                                    <Row>
                                        <Col className="text-center mt-4">
                                            <Button color="primary" onClick={() => this.scanDoc()}>Scan Document</Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="1"></Col>
                    </Row>
                </Col>
                
            </Row>
        )
    }
}