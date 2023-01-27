import React from 'react';
import ReactDOM from 'react-dom';
import Roboto from "./assets/fonts/Roboto-Regular.ttf";
import {App} from "./App";

let div = document.createElement("div");
// add fonts
let fontFace = new FontFace(
    "Roboto",
    `url(${IS_PRODUCTION ? browser.runtime.getURL('fonts/Roboto-Regular.ttf') : Roboto})`
);
document.fonts.add(fontFace);

// add form to the page
div.id = "code-gem";
div.style.position = "fixed";
div.style.top = "20px";
div.style.right = "10px";
div.style.zIndex = "999";
div.style.maxHeight = "90vh";
div.style.height = "700px";
div.style.transition = "transform 0.3s ease-in";
div.style.fontFamily = `'Roboto'`;

// allow user to dismiss the feedback form
let listener = (e) => {
    if (e.target.className.indexOf("card-dismiss") >= 0) {
        div.style.transform = "translateX(370px)";
        div.removeEventListener("click", listener);
    }
};

div.addEventListener("click", listener);

document.body.appendChild(div);

ReactDOM.render(<App/>, div);
