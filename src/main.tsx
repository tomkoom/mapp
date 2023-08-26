import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// auth
import { AuthProvider } from "./context/Auth";

// state
import { Provider } from "react-redux";
import { store } from "./state/_store";

// styles
import GlobalStyles from "./styles/_global.styles";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalStyles />
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>,
);
