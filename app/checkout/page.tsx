import Container from "../components/Container";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import DottedLoadingSpinner from "../components/loading-spinner/SpinnerDotted";

const Checkout = () => {
  return (
    <div className="py-8 md:p-8">
      <Container>
        <Suspense fallback={<DottedLoadingSpinner />}>
          <CheckoutClient />
        </Suspense>
      </Container>
    </div>
  );
};

export default Checkout;
