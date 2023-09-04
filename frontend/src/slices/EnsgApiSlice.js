import { apiEnsgSlice } from "./apiEnsgSlice";
const INFO_URL='/api/ensg';

export const ensgApiSlice = apiEnsgSlice.injectEndpoints({
    endpoints:(builder)=>({
        add:builder.mutation({
            query:(data)=> {
                console.log('from api')
              return {
                url:`${INFO_URL}/add`,
                method:'POST',
                body:data,
            };
            }
            
        }),
        get:builder.mutation({
            query:()=>({
                url:`${INFO_URL}/get`,
                method:'GET'
            })
        }),
        delete:builder.mutation({
            query:(id)=>({
                url: `${INFO_URL}/${id}`, // Use the 'id' parameter in the URL template
                method:'DELETE'
            })
        }),
        edit: builder.mutation({
            query: (data) => {
                console.log(data.id)
                const idToUpdate=data.id
              return {
                url: `${INFO_URL}/${idToUpdate}`,
                method: 'PUT',
                body: data,
              };
            },
          }),
    })
});

export const {useAddMutation,useGetMutation,useDeleteMutation,useEditMutation}=ensgApiSlice;