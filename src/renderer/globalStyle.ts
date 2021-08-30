import { createGlobalStyles as css } from "goober/global";

export const GlobalStyle = css`
  * {
    box-sizing: border-box;
    font-family: "Lato", sans-serif;
  }

  html {
    font-size: calc(112.5% + 0.25vw);
  }

  body {
    background-color: transparent;
    margin: 0;
    padding: 0;
    -webkit-app-region: drag;
  }
`;