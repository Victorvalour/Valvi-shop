"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import Input from "@/app/components/inputs/input";
import { categories } from "@/utils/Categories";
import { imageSelect } from "@/utils/Images";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import axios from "axios";
import { useRouter } from "next/navigation";

export type ImageType = {
  image: File | null;
  imageIndex: string;
};
export type SpecType = {
  spec: string | null;
  specIndex: string;
};
export type UploadedImageType = {
  image: string;
};

const AddProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);






  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      specifications: [],
      brand: "",
      category: "",
      inStock: false,
      images: [],
      price: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // from useForm
    name: "specifications", // This should match the field name in the defaultValues
  });

  const addSpecification = () => {
    if (fields.length < 8) {
      append({ spec: "" });
    }
  };

  const removeSpecification = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    setCustomValue("images", images);
  
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  const onsubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);

    setIsLoading(true);
    // Save  the image firebase
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error("Please add a category");
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("Please add a product image");
    }

    const handleImageUploads = async () => {
      toast("Creating product, please wait...");

      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + "-" + item.image.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      console.log("Upload is paused");
                      break;
                    case "running":
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => {
                  // Handle unsuccessful uploads
                  console.log("Error uploading image", error);

                  reject(error);
                },
                () => {
                  // Handle successful uploads on complete

                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });
                      console.log("File available at", downloadURL);
                      resolve();
                    })
                    .catch((error) => {
                      console.log("Error getting the download URL", error);

                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handling image uploads", error);
        return toast.error("Error handling image uploads");
      }
    };

    await handleImageUploads();
    const productData = { ...data, images: uploadedImages };
    console.log("Product data:", productData);

    // Save the product to mongoBD
    axios
      .post("/api/product", productData)
      .then(() => {
        setIsProductCreated(true);
        toast.success("Product created successfully");

        router.refresh();
        window.location.reload();
      })
      .catch(() => {
        toast.error("something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);

  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (item) => item.image !== value.image
        );

        return filteredImages;
      }

      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Add a product" />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Price"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="number"
        required
      />
      <Input
        id="brand"
        label="Brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

<div className="w-full flex flex-col gap-4">
        <div className="font-bold">Specifications</div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
         
            <Input
              id={`specifications.${index}.spec`}
              label={`Specification Value ${index + 1}`}
              disabled={isLoading}
              register={register}
              errors={errors}
            />
            {index > 1 && (
              <button type="button" onClick={() => removeSpecification(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        {fields.length < 8 && (
          <button className="border-2 border-slate-400 p-2 border-dashed cursor-pointer text-sm font-normal text-slate-400 flex items-center justify-center" onClick={addSpecification}>Add more specs</button>
        )}
      </div>

      <CustomCheckBox
        id="inStock"
        register={register}
        label="This product is in stock"
      />

      <div className="w-full medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
          {categories.map((item) => {
            if (item.label === "All") {
              return null;
            }
            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          {" "}
          <div className="font-bold">
            Select the available product colors and upload their images.
          </div>
          <div className="text-sm">
            You must upload an image for each of the color selected otherwise
            your color selection will be ignored.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {imageSelect.map((item, index) => {
            return (
              <SelectColor
                key={index}
                item={item}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={false}
              />
            );
          })}
        </div>
      </div>

      <Button
        label={isLoading ? "Loading..." : "Add Product"}
        onClick={handleSubmit(onsubmit)}
      />
    </>
  );
};

export default AddProductForm;
