import Link from "next/link";
import Container from "../Container";
import { Redressed } from "next/font/google";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Categories from "./Categories";
import { Suspense } from "react";
import DottedLoadingSpinner from "../loading-spinner/SpinnerDotted";
import SearchBar from "./SearchBar";
import Image from "next/image";
import Logo from "../../icon.svg";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const NavBar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="sticky top-0 w-full bg-[#c8fdd2] z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link
              href="/"
              className={`${redressed.className} font-bold text-2xl flex items-center`}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="object-contain w-[40px] h-[40px]"
                />
                <span>VALVITEK</span>
              </div>
            </Link>

            <div className="hidden md:block py-2">
              <SearchBar />
            </div>
            <div className="flex items-center gap-8 md:gap-12">
              <CartCount />
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
      <Suspense fallback={<DottedLoadingSpinner />}>
        <Categories />
      </Suspense>
    </div>
  );
};

export default NavBar;
