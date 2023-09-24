import { apiParentSlice } from "./apiparentsSlice";
const INFO_URL='/api/parent';

export const parentApiSlice = apiParentSlice.injectEndpoints({
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
                url: `${INFO_URL}/${id}`, 
                method:'DELETE'
            })
        }),
       
    })
});

export const {useGetMutation,useDeleteMutation,usePostMutation}=parentApiSlice;