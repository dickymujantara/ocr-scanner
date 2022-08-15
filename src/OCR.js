import React, {Component} from "react";
import Resizer from "react-image-file-resizer";
import Tesseract from 'tesseract.js'
import { Row, Col, Card, CardHeader, CardBody, Button } from "reactstrap";

export default class OCR extends Component{

    constructor(props){
        super(props)
        this.webcamRef = React.createRef()
        this.state = {
            isLoading : false,
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
        this.setState({isLoading : true})
        Tesseract.recognize(
            image,
            'eng',
            // { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            const clearText = this.clearingText(text)
            console.log(clearText);
            if (type === "front") {
                let map = this.mappingFrontDoc(clearText)
                this.setState({frontResultText : map})
            }else{
                let map = this.mappingBackDoc(clearText)
                this.setState({backResultText : map})
            }
            this.setState({isLoading : false})
            return text
        })
    }

    clearingText(text){
        const clearText = text.replace(/[@*%".§:;{}())|\\~!=,'`‘<>?&”]/g,"")
        const splitText = clearText.split(["\n"])

        if (splitText[0] != "REPUBLIC OF SINGAPORE") {
            splitText.splice(0,1)
        }

        for (let i = 0; i < splitText.length; i++) {
            if (splitText[i].trim().length < 5 || splitText[i] == '') {
                console.log("Remove : ", splitText[i]);
                splitText.splice(i,1)
            }
        }

        return splitText.filter(e =>  e)
    }

    mappingFrontDoc(arrText){
        const id = arrText[1].split(" ")[3].replace("$","S")
        const name = arrText[2]
        const race = arrText[4].split(" ")[0]
        let dob, sex, country

        if (arrText.length % 2 == 0) {
            let dobS = arrText[5].split(" ")
            dob = dobS[1]
            sex = dobS[2]
            country = arrText[7]
        }else{
            let dobS = arrText[6].split(" ")
            dob = dobS[1]
            sex = dobS[2].toUpperCase()
            country = arrText[8]
        }

        return {
            id : id,
            name : name,
            dob : dob,
            sex : sex,
            race : race,
            country : country
        }
    }

    mappingBackDoc(arrText){
        return {
            nationality : arrText[2],
            address: `${arrText[6]} ${arrText[7]} ${arrText[8]}`,
            streetName : arrText[6],
            unitNumber : arrText[7],
            postalCode : arrText[8].split(" ")[1]
        }
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
                                    <h2>Upload Document</h2>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <h4>Front Doc</h4>
                                            <img src={this.state.frontDocImg} className="img-fluid"/>
                                            <input type="file" className="form-control mt-2" onChange={e => this.uploadPhoto(e.target.files[0],"front")}/>
                                            {
                                                this.state.frontResultText !== null && !this.state.isLoading
                                                ?   <>
                                                        <h5>Result :</h5>
                                                        <p>ID : {this.state.frontResultText.id}</p>
                                                        <p>NAME : {this.state.frontResultText.name}</p>
                                                        <p>RACE : {this.state.frontResultText.race}</p>
                                                        <p>Date of Birth : {this.state.frontResultText.dob}</p>
                                                        <p>Sex : {this.state.frontResultText.sex}</p>
                                                        <p>Country/Place of birth : {this.state.frontResultText.country}</p>
                                                    </>
                                                : <></>
                                            }
                                        </Col>
                                        <Col>
                                            <h4>Back Doc</h4>
                                            <img src={this.state.backDocImg} className="img-fluid"/>
                                            <input type="file" className="form-control mt-2" onChange={e => this.uploadPhoto(e.target.files[0],"back")}/>
                                            {
                                                this.state.backResultText !== null && !this.state.isLoading
                                                ?   <>
                                                        <h5>Result :</h5>
                                                        <p>Nationality : {this.state.backResultText.nationality}</p>
                                                        <p>Address : {this.state.backResultText.address}</p>
                                                        <p>Street Name : {this.state.backResultText.streetName}</p>
                                                        <p>Unit Number : {this.state.backResultText.unitNumber}</p>
                                                        <p>Postal Code : {this.state.backResultText.postalCode}</p>
                                                    </>
                                                : <></>
                                            }
                                        </Col>
                                    </Row>
                                    {
                                        this.state.isLoading
                                        ?   <Row className="text-center mt-3">
                                                <Col>
                                                    <span className="spinner-border text-primary"></span>
                                                </Col>
                                            </Row>
                                        : <></>
                                    }
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