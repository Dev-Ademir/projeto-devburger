import {createGlobalStyle} from "styled-components";

const globalStyles = createGlobalStyle `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: none;
    }
    
    button {
        cursor: pointer;
    }
    h1 {
    background-color: lime
    }
`
export default globalStyles;