import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery=fetchBaseQuery({ baseUrl:'' } );

export const apiEleveSlice=createApi({ 
    baseQuery,
    tagTypes:['Eleve'],
    endpoints:(builder)=>({})
 } );