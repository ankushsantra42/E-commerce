import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState ={
    isLoading : false,
    searchResults:[]
}


export const getSearchResults = createAsyncThunk("/search/getsearchresults",
    async (keyword)=>{
        try{
            const response = await axios.get(`http://localhost:5000/api/shop/search/${keyword}`)

            return response.data
        }catch(error){
            console.log(error)
        }
    }
)


const searchSlice = createSlice({
    name : "searchSlice",
    initialState,
    reducers : {
        resetSearchResults: (state) => {
      state.searchResults = [];
    },
    },
    extraReducers : (builder)=>{
        builder.addCase(getSearchResults.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getSearchResults.fulfilled, (state, action)=>{
            state.isLoading = false
            state.searchResults = action.payload.data
        })
        .addCase(getSearchResults.rejected, (state)=>{
            state.isLoading = false
        })
    },

})

export const { resetSearchResults } = searchSlice.actions
export default searchSlice.reducer
    