import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery=fetchBaseQuery({ baseUrl:'' } );

export const apiFormationSlice=createApi({ 
    baseQuery,
    tagTypes:['Formations'],
    endpoints:(builder)=>({})
 } );