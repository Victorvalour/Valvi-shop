import Container from "../components/Container";

import CheckoutClient from "./CheckoutClient";

const Checkout = () => {
  return (
    <div className="py-8 md:p-8">
      <Container>
        <CheckoutClient />
      </Container>
    </div>
  );
};

export default Checkout;
