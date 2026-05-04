import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './customBaseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products/all',
      // Provide the general "Product" tag to refetch when invalidated
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Product', id })), 'Product']
          : ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/find/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    insertProduct: builder.mutation({
      query: (product) => ({
        url: '/products/insert',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/update/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product'
      ],
    }),
    deleteProductById: builder.mutation({
      query: (id) => ({
        url: `/products/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useInsertProductMutation,
  useUpdateProductMutation,
  useDeleteProductByIdMutation
} = apiSlice;
