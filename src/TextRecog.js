import Tesseract from 'tesseract.js';

export const TextRecog = (image) => {
    Tesseract.recognize(
        image,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log(text);
    })
}