import { FaRegCheckCircle } from "react-icons/fa";
import Button from "../components/Button";
import { useRouter } from "next/navigation";

const PaymentSuccess = () => {
  const router = useRouter();
  return (
    <div className="absolute inset-0  top-0 flex flex-col items-center justify-center gap-2 bg-white bg-opacity-80">
      <div className="z-10 text-center">
        <FaRegCheckCircle className="text-9xl" />
      </div>
      <p className="mt-4 text-2xl font-semibold">Checkout Successful</p>
      <div className="z-10 mt-6">
        <Button
          label="View your orders"
          onClick={() => {
            router.push("/orders");
          }}
        />
      </div>
    </div>
  );
};

export default PaymentSuccess;
