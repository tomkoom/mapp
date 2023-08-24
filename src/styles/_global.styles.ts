import { createGlobalStyle } from "styled-components";
import rootCss from "./root.module.css";
import fontsCss from "./fonts.module.css";

const GlobalStyles = createGlobalStyle`
  /* –––ROOT––– */

  ${rootCss}

  /* –––FONTS––– */

  ${fontsCss}

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;

  /* –––TYPOGRAPHY––– */

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: var(--fwSemiBold);
    line-height: 100%;
  }

  h1 {
    font-size: var(--fs1);
  }

  h2 {
    font-size: var(--fs2);
  }

  h3 {
    font-size: var(--fs3);
  }

  h4 {
    font-size: var(--fs4);
  }

  h5 {
    font-size: var(--fs5);
  }

  h6 {
    font-size: var(--fs6);
  }

  /* –––LAYOUT––– */

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: var(--fontFamily);
  }

  html {
    font-size: 20px; /* root font size */
  }

  body {
    color: var(--primaryColor);
  }

  input {
    all: unset;
  }

  button {
    color: inherit;
    background: none;
    border: none;
    outline: inherit;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }

  a {
    color: var(--primaryColor);
    text-decoration: underline;
  }

  p,
  span,
  a,
  label,
  ul {
    line-height: 150%;
    font-size: var(--fs6);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  code {
    font-family: var(--monospace);
    font-size: var(--fs5);
  }

  /* make images easier to work with */
  img,
  picture {
    max-width: 100%;
    display: block;
  }

  input::placeholder {
    color: var(--tertiaryColor);
  }

  /* classes */

  .sectionTitle {
    margin-bottom: 1rem;
  }
`;

export default GlobalStyles;
