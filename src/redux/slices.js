import { createSlice } from "@reduxjs/toolkit";

const auctionDataSlice = createSlice({
    name: 'auctionData',
    initialState: {auctionItems: {},chatData:[]},
    reducers: {
        setItems: (state, action)=>{
            state.auctionItems = action.payload
        },
        setChats : (state, action) =>{
            state.chatData = action.payload
        }

    }

})

export default auctionDataSlice.reducer
export const auctionActions = auctionDataSlice.actions

// {clothing:  key:{data}, key:{} }, {elecronics: key:{data}}, {}, {}