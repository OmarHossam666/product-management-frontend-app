import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000/api/products' }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/all',
      // Provide the general "Product" tag to refetch when invalidated
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Product', id })), 'Product']
          : ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/find/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    insertProduct: builder.mutation({
      query: (product) => ({
        url: '/insert',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/update/${id}`,
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
        url: `/delete/${id}`,
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
