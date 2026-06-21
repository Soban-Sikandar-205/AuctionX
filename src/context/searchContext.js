import { createContext, useContext } from "react";

export const searchContext = createContext({
    searchQuery: '',
    updateSearchQuery : ()=>{}
})

export const SearchProvider = searchContext.Provider

export default function useSearch(){
    return useContext(searchContext)
}