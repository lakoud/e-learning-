import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery=fetchBaseQuery({ baseUrl:'' } );

export const apiEnsgSlice=createApi({ 
    baseQuery,
    tagTypes:['Ensg'],
    endpoints:(builder)=>({})
 } );