import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}

:root {
  --color-action: red;
  --color-primary: #235ad1;
  --color-white: #ffffff;
}

html {
    scroll-behavior: smooth;
    font-size:10px;
}
body {
  font-size:1.6rem;
  font-family: "ProximaNova", "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  color: black;

}

#root {
  height: 100%;
}


h1 {
  text-align: left;
  color: #151b2b;
  font-size: 26px;
}
h2{
  font-size: 21px;
}
h3{
  font-size: 17px;
}

`;
