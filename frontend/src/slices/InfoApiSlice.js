import { apiSlice } from "./apiSlice";
const INFO_URL='/api/info';

export const infoApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        add:builder.mutation({
            query:(data)=> ({
                url:`${INFO_URL}/`,
                method:'POST',
                body:data,

            })
        }),
        geted:builder.mutation({
            query: () => {
                console.log('hey')
                return {
                  url: `${INFO_URL}/get`,
                  method: 'GET',
               };
              },
        }),
        delete:builder.mutation({
            query:(id)=>({
                url: `${INFO_URL}/${id}`, 
                method:'DELETE'
            })
        }),
        update: builder.mutation({
            
            query: (data) => {
              const idToUpdate = data._id;
         
              return {
                url: `${INFO_URL}/${idToUpdate}`,
                method: 'PUT',
                body: data,
              };
            },
          }),
    })
});

export const {useAddMutation,useGetedMutation,useDeleteMutation,useUpdateMutation}=infoApiSlice;