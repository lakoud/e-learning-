import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery=fetchBaseQuery({ baseUrl:'' } );

export const apiParentSlice=createApi({ 
    baseQuery,
    tagTypes:['Parent'],
    endpoints:(builder)=>({})
 } );