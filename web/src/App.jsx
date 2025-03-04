import { Box, ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import store from "./redux/store/store.js";
import AppRoutes from "./Routes";
import theme from "./theme";
import { GOOGLE_AUTH_CLIENT_ID } from "./utils/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarWithHeader from "./components/Navbar/Sidebar";
import Meta from "./components/Meta";

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider resetCSS theme={theme}>
        <Meta />
        <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
          <BrowserRouter>
            <SidebarWithHeader>
              <Box height={"calc(100vh - 65px - 73px)"} position="relative" overflow="auto">
                <AppRoutes />
              </Box>
              <Footer />
            </SidebarWithHeader>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
