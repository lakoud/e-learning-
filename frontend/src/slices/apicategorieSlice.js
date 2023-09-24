import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery=fetchBaseQuery({ baseUrl:'' } );

export const apiCategorieSlice=createApi({ 
    baseQuery,
    tagTypes:['Cateogire'],
    endpoints:(builder)=>({})
 } );