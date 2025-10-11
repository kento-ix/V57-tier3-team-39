"use client";
import { useAtom } from "jotai";
import { ownerAtom, repoAtom, tokenAtom } from "@/atoms/prAtoms";
import { Text } from "@mantine/core";
import type { PullRequest } from "@/types/pr";
import { savePRsAsJSON } from "@/lib/downloadPRs";
import { useState } from "react";
import { Info } from "lucide-react"; 

interface Props {
  onFetch: () => void;
  prs: PullRequest[];
}

export default function RepoSettingsForm({ onFetch, prs }: Props) {
  const [owner, setOwner] = useAtom(ownerAtom);
  const [repo, setRepo] = useAtom(repoAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [showInfo, setShowInfo] = useState(false);

  const isDisabled = !owner || !repo;

  return (
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
            placeholder="GitHub username or org (e.g. vercel)"
            style={{ fontSize: "20px" }}
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
            placeholder="Repository name (e.g. blog-platform)"
            style={{ fontSize: "20px" }}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <Text component="label" size="lg" className="block font-medium mb-1">
            GitHub Personal Access Token (Optional)
          </Text>

          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
            aria-label="More info about token"
          >
            <Info size={16} />
          </button>
        </div>

        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Optional: ghp_youraccesstoken"
          style={{ fontSize: "20px" }}
          className="w-full border border-gray-300 px-3 py-2 rounded-md"
        />

        {showInfo && (
          <p className="mt-2 text-lg text-gray-700 bg-purple-50 p-3 rounded-md border border-purple-200">
            💡 A GitHub personal access token increases API rate limits from{" "}
            <strong>60</strong> to <strong>5,000</strong> requests per hour.
            <br />
            Create one at:{" "}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 underline"
            >
              github.com/settings/tokens
            </a>
          </p>
        )}

      </div>



      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onFetch}
          disabled={isDisabled}
          style={{ fontSize: "20px", backgroundColor: isDisabled ? "#D6BCFA" : "#805AD5" }}
          className={`px-4 py-2 rounded-md text-white cursor-pointer ${
            isDisabled ? "cursor-not-allowed" : "hover:brightness-90"
          }`}
        >
            Fetch Pull Requests
        </button>

        <button 
          onClick={() => savePRsAsJSON(prs)}
          disabled={prs.length === 0}
          className={`px-4 py-2 rounded-md text-white ${
            prs.length === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          Save PRs as JSON
        </button> 
      </div>
    </div>
  );
}
