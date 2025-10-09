"use client";
import Link from "next/link";
import Image from "next/image";
import appLogo from "../public/images/app_logo.png";
import { FaBars } from "react-icons/fa";
import { useState } from "react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const date = new Date();
  const formattedDate = date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");

  return (
    <header className="bg-[#805AD5]">
      <nav className="flex text-center max-w-[1280px] mx-auto text-white p-4 items-center">
        <div className="flex items-center gap-3 w-1/3">
          <div className="w-[86px] flex-shrink-0">
            <Link href="/">
              <Image
                src={appLogo}
                alt="Logo"
                width={86}
                height={86}
                className="object-contain"
              />
            </Link>
          </div>

          <Link href="/" className="block [@media(max-width:490px)]:hidden">
            <h1 className="font-bold text-xl">PRTrackr</h1>
          </Link>
        </div>

        <div className="flex md:flex-row-reverse justify-center items-center w-2/3">
          <div className="flex justify-end w-1/2 md:pr-8">
            <p>{formattedDate}</p>
          </div>

          <div className="hidden md:flex justify-center items-center gap-10 lg:gap-[128px] font-medium w-1/2">
            <Link href="/open-prs">Open PRs</Link>
            <Link href="/closed-prs">Closed PRs</Link>
          </div>
        </div>

        <div className="flex items-center w-1/2 justify-end md:hidden ">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaBars size={32} />
          </button>
        </div>

        {isMenuOpen && (
          <div className="bg-[#805AD5] absolute top-16 right-3 text-white flex flex-col items-center gap-4 p-4 shadow-lg overflow-hidden transform transition-all duration-200 md:hidden">
            <Link href="/open-prs" onClick={() => setIsMenuOpen(false)}>
              Open PRs
            </Link>
            <Link href="/closed-prs" onClick={() => setIsMenuOpen(false)}>
              {" "}
              Closed PRs
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
