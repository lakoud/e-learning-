import { apiEleveSlice } from "./apieleveSlice";
const INFO_URL='/api/eleve';

export const eleveApiSlice = apiEleveSlice.injectEndpoints({
    endpoints:(builder)=>({
        post:builder.mutation({
            query:()=>({
                url:`${INFO_URL}/`,
                method:'POST'
            })
        }),
        get:builder.mutation({
            query:()=>({
                url:`${INFO_URL}/`,
                method:'GET'
            })
        }),
        delete:builder.mutation({
            query:(id)=>({
                url: `${INFO_URL}/${id}`, // Use the 'id' parameter in the URL template
                method:'DELETE'
            })
        }),
       
    })
});

export const {useGetMutation,useDeleteMutation,usePostMutation}=eleveApiSlice;