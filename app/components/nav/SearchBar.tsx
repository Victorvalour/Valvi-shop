"use client";

import { useRouter } from "next/navigation";
import queryString from "query-string";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const SearchBar = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      searchTerm: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!data.searchTerm) return router.push("/");

    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: {
          searchTerm: data.searchTerm,
        },
      },
      { skipNull: true }
    );

    router.push(url);
    reset();
  };

  return (
    <div className="flex items-center h-6 mt-2">
      <input
        {...register("searchTerm")}
        autoComplete="off"
        type="text"
        placeholder="Search products"
        className="p-2 border-secondaryColor border-[0.5px] rounded-l-md focus:outline-none focus:border-[1px] focus:border-primaryColor w-48 md:w-80 h-[35px] md:h-[40px]"
      />
      <button
        onClick={handleSubmit(onSubmit)}
        className="bg-primaryColor border-primaryColor border-[1px] hover:opacity-80 text-white p-2 rounded-r-md my-2 h-[35px] md:h-[40px]"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
