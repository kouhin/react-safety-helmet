import {createProvider} from "react-redux";
import {STORE_KEY} from "./HelmetConstants";

const HelmetProvider = createProvider(STORE_KEY);
HelmetProvider.displayName = "HelmetProvider";

export default HelmetProvider;
