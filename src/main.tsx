import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// auth
import { AuthProvider } from "./context/Auth";

// styles
import GlobalStyles from "./styles/_global.styles";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalStyles />
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
