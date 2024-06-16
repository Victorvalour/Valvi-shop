import Container from "../components/Container";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

const Checkout = () => {
  return (
    <div className="py-8 md:p-8">
      <Container>
        <Suspense fallback={<>Loading...</>}>
          <CheckoutClient />
        </Suspense>
      </Container>
    </div>
  );
};

export default Checkout;
