import { apiSlice } from "./apiSlice";
const USERS_URL='/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        
        login:builder.mutation({
            query:(data)=> ({
                url:`${USERS_URL}/auth`,
                method:'POST',
                body:data,

            })
        }),
        
        logout:builder.mutation({
            query:()=>({
                url:`${USERS_URL}/logout`,
                method:'POST'
            })
        }),
        post:builder.mutation({
            query:(data)=> ({
                url:`${USERS_URL}/resetPassword`,
                method:'POST',
                body:data,

            })
        }),
        send:builder.mutation({
            query:(data)=> ({
                url:`${USERS_URL}/writePassword`,
                method:'POST',
                body:data,

            })
        }),
        modifier:builder.mutation({
            query:(data)=> ({
                url:`${USERS_URL}/modifierPassword`,
                method:'POST',
                body:data,

            }),
            
        }),
        Update:builder.mutation({
            query:(data)=> ({
                url:`${USERS_URL}/profile`,
                method:'PUT',
                body:data,

            }), }),
            Change:builder.mutation({
                query:(data)=> ({
                    url:`${USERS_URL}/notifications`,
                    method:'PUT',
                    body:data,
    
                }), }),
        get:builder.mutation({
                query:()=> ({
                    url:`${USERS_URL}/profile`,
                    method:'GET',
    
                }), }),
        
    })
});

export const {useLoginMutation,useLogoutMutation,usePostMutation,useSendMutation,useModifierMutation,useUpdateMutation,useGetMutation,useChangeMutation}=usersApiSlice;