"use client";
import Link from "next/link";
import Image from "next/image";
import appLogo from "../public/images/app_logo.png";
import { FaBars } from "react-icons/fa";

const Header: React.FC = () => {
  const date = new Date();
  const formattedDate = date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");

  return (
    <header style={{ backgroundColor: "#805AD5" }}>
      <nav className="flex justify-between text-center max-w-[1280] mx-auto text-white p-4 items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src={appLogo} alt="Logo" width={50} height={50} />
          </Link>
          <Link href="/">
            <h1>PRTrackr</h1>
          </Link>
        </div>

        <div>
          <p>{formattedDate}</p>
        </div>

        <div className="md:hidden flex items-center">
          <button>
            <FaBars size={32} />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-6 font-medium">
          <Link href="/open-prs">Open PRs</Link>
          <Link href="/closed-prs">Closed PRs</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
