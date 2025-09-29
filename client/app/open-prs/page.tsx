"use client";

import { useState } from "react";
import type { PullRequest } from "@/types/pr";
import PullRequestCard from "@/components/OpenPRCard";
import { Box, Text } from "@mantine/core";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

export default function OpenPRsPage() {
    const [prs, setPrs] = useState<PullRequest[]>([]);
    const [error, setError] = useState("");
    // Default value to test (owner and repo name)
    const [owner, setOwner] = useState("chingu-voyages");
    const [repo, setRepo] = useState("V57-tier3-team-39");
    const [token, setToken] = useState("");
    const [page, setPage] = useState(1);

    const isDisabled = !owner || !repo;
    const PAGE_SIZE = 3;
    const totalPages = Math.max(1, Math.ceil(prs.length / PAGE_SIZE));
    const paginatedPRs = prs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


    const fetchPRs = async () => {
        setError("");
        try {
            const res = await fetch(
                `/api/openPR?owner=${owner}&repo=${repo}&token=${token}`
            );

            if (!res.ok) {
                throw new Error("Invalid repository name");
            }
            const data = await res.json();
            const mapped: PullRequest[] = data.map((pr: any) => ({
                number: pr.number,
                title: pr.title,
                author: pr.author ?? pr.user?.login ?? "Unknown",
                createdAt: pr.createdAt ?? pr.created_at ?? "",
                updatedAt: pr.updatedAt ?? pr.updated_at ?? "",
                requested_reviewers:
                    pr.requested_reviewers?.map((r: any) => r.login) ??
                    pr.requestedReviewers ??
                    [],
                lastAction: pr.lastAction ?? "open",
                url: pr.url ?? pr.html_url ?? "",
            }));

            setPrs(mapped);
        } catch (err: any) {
            setError(err.message);
            setPrs([]);
        }
    };

  return (
    <div style={{ backgroundColor: "#F0E7FF"}}>
        <div className="p-3 text-4xl font-bold text-center" style={{ color: "#2D3748"}}>Open Pull Requests</div>

        <div className="mt-8 mx-4 p-6 shadow-lg rounded-lg bg-white lg:max-w-4xl lg:mx-auto">
            <h2 className="text-xl font-bold mb-4">Repository Settings</h2>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Text component="label" size="lg" className="block font-medium mb-1">
                        Repository Owner
                    </Text>
                    <input
                        type="text"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        placeholder="e.g... facebook"
                        style={{fontSize: "20px"}}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                </div>

                <div className="flex-1">
                    <Text component="label" size="lg" className="block font-medium mb-1">
                        Repository Name
                    </Text>
                    <input
                        type="text"
                        value={repo}
                        onChange={(e) => setRepo(e.target.value)}
                        placeholder="e.g... react"
                        style={{fontSize: "20px"}}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                </div>
            </div>

            <div className="mt-4">
                <Text component="label" size="lg" className="block font-medium mb-1">
                    GitHub Personal Access Token (Optional)
                </Text>
                <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_..."
                    style={{fontSize: "20px"}}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                    onClick={fetchPRs}
                    disabled={isDisabled}
                    style={{fontSize: "20px"}}
                    className={`px-4 py-2 rounded-md text-white ${
                        isDisabled
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                Fetch Pull Requests
                </button>
            </div>
        </div>

        {/* Display fetch data */}
        <div className="m-8 mx-4 p-1 border border-gray-300 bg-white lg:max-w-4xl lg:mx-auto">
            {error && (
                <div className="flex justify-center items-center h-32">
                    <p className="text-red-500 text-2xl">{error}</p>
                </div>
            )}

            {prs.length > 0 && (
                <div className="pl-6">
                    <Text size="xl" fw={700}>
                        PR Display
                    </Text>
                </div>
            )}

            {prs.length === 0 && !error ? (
                <div className="text-gray-600 text-2xl">No open PRs</div>
            ) : (
                paginatedPRs.map((pr) => <PullRequestCard key={pr.number} pr={pr} />)
            )}
        </div>

        {prs.length > 1 && (
            <div className="flex items-center justify-center gap-6 mb-8">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`py-2 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
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
                    className={`py-2 ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ color: "#805AD5", fontSize: "2rem" }}
                >
                    <BiSolidRightArrow />
                </button>
            </div>

        )}
    </div>
  );
}