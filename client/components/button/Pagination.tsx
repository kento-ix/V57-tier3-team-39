"use client";
import { useAtom } from "jotai";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import type { PrimitiveAtom } from "jotai";
import { PullRequest } from "@/types/pr";

interface Props {
    pageAtom: PrimitiveAtom<number>;
    prsAtom: PrimitiveAtom<PullRequest[]>;
}

export default function Pagination({ pageAtom, prsAtom }: Props) {
    const [page, setPage] = useAtom(pageAtom);
    const [prs] = useAtom(prsAtom);

    const PAGE_SIZE = 3;
    const totalPages = Math.max(1, Math.ceil(prs.length / PAGE_SIZE));
    
    if (prs.length <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-6 mb-8">
            <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`py-2 ${page === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                style={{ color: "#805AD5", fontSize: "2rem" }}
            >
                <BiSolidLeftArrow />
            </button>

            <span className="text-xl font-semibold" style={{ color: "#2D3748" }}>
                {page} / {totalPages}
            </span>

            <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`py-2 ${page === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                style={{ color: "#805AD5", fontSize: "2rem" }}
            >
                <BiSolidRightArrow />
            </button>
        </div>
    );
}
