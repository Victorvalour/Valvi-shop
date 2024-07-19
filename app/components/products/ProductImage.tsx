"use client";

import {
  CartProductType,
  SelectedImageType,
} from "@/app/product/[productId]/ProductDetails";
import Image from "next/image";

interface ProductImageProps {
  product: any;
  handleColorSelect: (value: SelectedImageType) => void;
  selectedImage: SelectedImageType;
}

const ProductImage: React.FC<ProductImageProps> = ({
  product,
  handleColorSelect,
  selectedImage,
}) => {
  console.log(product);
  return (
    <div className="grid grid-cols-6 gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      <div className="flex-col items-center justify-center gap- cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
        {product.images.map((image: SelectedImageType) => {
          return (
            <div
              key={image.image}
              onClick={() => handleColorSelect(image)}
              className={`relative w-[80%] aspect-square rounded border-teal-300 my-2 ${
                selectedImage.image === image.image
                  ? "border-[1.5px]"
                  : "border-none"
              }`}
            >
              <Image
                src={image.image}
                alt={image.image}
                fill
                className="object-contain"
              />
            </div>
          );
        })}
      </div>
      <div className="col-span-5 relative aspect-square">
        <Image
          fill
          className="w-full h-full object-contain  max-h-[500px] min-h-[300px] sm:min-h-[400px]"
          src={selectedImage.image}
          alt={selectedImage.image}
        />
      </div>
    </div>
  );
};

export default ProductImage;
