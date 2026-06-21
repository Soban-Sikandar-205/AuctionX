import { configureStore } from "@reduxjs/toolkit";
import auctionDataSliceReducer from "./slices";

const store = configureStore({
        reducer: {auctionDataReducer: auctionDataSliceReducer}

})

export default store
