import React, {Component} from "react";
import Webcam from "react-webcam";
import Resizer from "react-image-file-resizer";
import Tesseract from 'tesseract.js';

export default class OCR extends Component{

    constructor(props){
        super(props)
        this.webcamRef = React.createRef()
        this.state = {
            captureImage : null,
            resizeImage : null,
            resultText : null,
            arrText : []
        }
    }

    capturePhoto = () => {
        const image = this.webcamRef.current.getScreenshot()
        this.setState({captureImage : image})
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
        const resultText = this.textRecog(this.state.resizeImage)
        console.log("Result Text");
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
                
                <div>
                    <h1>Before</h1>
                    <img src={this.state.captureImage}/>
                    <h1>After</h1>
                    <img src={this.state.resizeImage}/>
                    <button onClick={() => this.photoScan()}>Scan Photo</button>
                </div>
                
                <div>
                    <h1>Raw Text</h1>
                    <span>{this.state.resultText}</span>
                    <h1>Convert to Array:</h1>
                    {
                        this.state.arrText.map(e => {
                            return(
                                <p>{e}</p>
                            )
                        })
                    }
                </div>

            </div>
        )
    }
}