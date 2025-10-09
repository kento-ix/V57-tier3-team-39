"use client";
import { useAtom } from "jotai";
import { useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import {
  closedPRsAtom,
  closedErrorAtom,
  closedPageAtom,
  ownerAtom,
  repoAtom,
  tokenAtom,
} from "@/atoms/prAtoms";
import RepoSettingsForm from "@/components/form/RepoSettingForm";
import PullRequestCard from "@/components/PullRequestCard";
import Pagination from "@/components/button/Pagination";
import type { PullRequest } from "@/types/pr";
import { Text, Box } from "@mantine/core";

export default function ClosedPRsPage() {
  const [prs, setPrs] = useAtom(closedPRsAtom);
  const [error, setError] = useAtom(closedErrorAtom);
  const [page] = useAtom(closedPageAtom);
  const [owner] = useAtom(ownerAtom);
  const [repo] = useAtom(repoAtom);
  const [token] = useAtom(tokenAtom);

  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 3;
  const paginatedPRs = prs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const fetchPRs = async () => {
    setLoading(true); 
    setError("");
    try {
      const tokenParam = token && token.trim() !== "" ? `&token=${token}` : "";
      const res = await fetch(
        `/api/closedPR?owner=${owner}&repo=${repo}${tokenParam}&limit=${limit}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "🚨 Unable to fetch pull requests.");
      }

      const prsData: PullRequest[] = data.prs || [];

      setPrs(prsData);
      setRateLimitRemaining(data.rateLimitRemaining ?? null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("🚨 Unable to fetch pull requests.");
      }
      setPrs([]);
      setRateLimitRemaining(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow">
      <h1 className="p-3 text-4xl font-bold text-center">
        Closed Pull Requests
      </h1>
      <RepoSettingsForm onFetch={fetchPRs} prs={prs} />

      <div className="flex justify-center gap-2 my-4">
        <label>Max PRs: </label>
        <input
          type="number"
          min={1}
          max={50}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border px-2 py-1"
        />
      </div>

      {rateLimitRemaining !== null && (
        <div className="text-gray-500 text-sm mt-2 text-center">
          🔹 GitHub API requests remaining: {rateLimitRemaining}
        </div>
      )}

      <div className="m-8 mx-4 p-1 border border-gray-300 bg-white lg:max-w-4xl lg:mx-auto">
        {/* Display error */}
        {error && (
          <div className="flex flex-col justify-center items-center h-48 gap-4 text-center">
            <p className="text-red-500 text-2xl">{error}</p>
            <button
              onClick={fetchPRs}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* PR display header */}
        <Box pos="relative">
          <LoadingOverlay
                visible={loading}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'purple', type: 'bars' }}
          />
          {paginatedPRs.length > 0 && (
            <div className="pl-6">
              <Text size="xl" fw={700}>
                PR Display
              </Text>
            </div>
          )}

          {/* If PR not found */}
          {paginatedPRs.length === 0 && !error ? (
            <div 
              className="text-gray-600 text-2xl text-center"
              role="status"
              aria-live="polite"
            >
              ✅ No closed pull requests yet
            </div>
          ) : (
            // Display each PR
            paginatedPRs.map((pr) => <PullRequestCard key={pr.number} pr={pr} />)
          )}
        </Box>
      </div>

      <Pagination pageAtom={closedPageAtom} prsAtom={closedPRsAtom} />
    </div>
  );
}
