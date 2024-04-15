import "./App.css";
import OpenLayersMap from "./components/OpenLayersMap";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
    return (
        <ChakraProvider>
            <div className="App">
                <OpenLayersMap />
            </div>
        </ChakraProvider>
    );
}

export default App;
