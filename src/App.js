import React, {Component} from "react";
import OCR from "./OCR";
import OCRCamera from "./OCRCamera";
import { Row, Col, Button } from "reactstrap";

export default class App extends Component{
  constructor(){
    super()
    this.state = {
      ocrType : null
    }
  }

  render(){
    return(
      <>
        {
          this.state.ocrType !== null
          ?
            <>
              {
                this.state.ocrType === "upload"
                ? <OCR/>
                : <OCRCamera/>
              }
            </>
          : <></>
        }
        <Row className="text-center my-5">
          <Col>
            <Button color="primary" className="mx-2" onClick={() => this.setState({ocrType : "upload"})}>Upload Photo</Button>
            <Button color="primary" onClick={() => this.setState({ocrType : "take"})}>Take Photo</Button>
          </Col>
        </Row>
      </>
    )
  }

}