"use client";

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatprice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import {
  MdCached,
  MdClose,
  MdDelete,
  MdDone,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";

interface ManageProductsClientProps {
  products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
  products,
}) => {
  let rows: any = [];
  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatprice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        product: product.images,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "name", headerName: "Name", width: 220 },
    {
      field: "price",
      headerName: "Price(NGN)",
      width: 220,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">{params.row.price}</div>
        );
      },
    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "brand", headerName: "Brand", width: 100 },
    {
      field: "inStock",
      headerName: "inStock",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.inStock === true ? (
              <Status
                text="In stock"
                icon={MdDone}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="Out of stock"
                icon={MdClose}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn icon={MdCached} onClick={() => {}} />
            <ActionBtn icon={MdDelete} onClick={() => {}} />
            <ActionBtn icon={MdRemoveRedEye} onClick={() => {}} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-[1250px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Products" center />
      </div>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default ManageProductsClient;
