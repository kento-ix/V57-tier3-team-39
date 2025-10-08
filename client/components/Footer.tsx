"use client";
import Link from "next/link";
import Image from "next/image";
import githubLogo from "../public/images/github-mark.png";

const Footer = () => {
  return (
    <footer className="flex justify-between justify-items-center text-center max-w-[1280] mx-auto text-white py-2 px-6 bg-[#805AD5] w-full">
      <div>
        <Link
          target="_blank"
          href="https://github.com/chingu-voyages/v57-tier3-team-39"
        >
          <Image src={githubLogo} alt="GitHub Logo" width={32} height={32} />
        </Link>
      </div>
      <div>
        <Link target="_blank" href="/credits">
          <p>Credits</p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
