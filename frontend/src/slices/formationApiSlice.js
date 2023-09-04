import { apiFormationSlice } from "./apiformationSlice";
const INFO_URL='/api/formation';

export const formationApiSlice = apiFormationSlice.injectEndpoints({
    endpoints:(builder)=>({
        add: builder.mutation({
            query: (data) => {
             console.log(data)
                

              return {
                url: `${INFO_URL}/`,
                method: 'POST',
                body: data,
              };
            },
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
        update:builder.mutation({
            query:(id)=>({
                url: `${INFO_URL}/${id}`, 
                method:'PUT'
            })
        }),
        update: builder.mutation({
            
            query: (data) => {
              const idToUpdate = data._id;
            console.log(data)
              return {
                url: `${INFO_URL}/${idToUpdate}`,
                method: 'PUT',
                body: data,
              };
            },
          }),
       
    })
});

export const {useAddMutation,useGetMutation,useDeleteMutation,useUpdateMutation}=formationApiSlice;