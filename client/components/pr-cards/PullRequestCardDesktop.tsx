"use client";

import { Card, Text } from "@mantine/core";
import { PullRequest } from "@/types/pr";
import { FaRegCommentDots, FaRegCheckCircle, FaRegEdit } from "react-icons/fa";

interface Props {
  pr: PullRequest;
  onSelect?: () => void;
}

export default function PullRequestCardDesktop({ pr, onSelect }: Props) {
  const actionIcon = () => {
    switch (pr.lastAction) {
      case "open": return <FaRegCheckCircle className="inline text-green-500 mx-3 size-6" />;
      case "approved": return <FaRegCheckCircle className="inline text-green-700 mx-3 size-6" />;
      case "commented": return <FaRegCommentDots className="inline text-blue-500 mx-3 size-6" />;
      case "changes_requested": return <FaRegEdit className="inline text-red-500 mx-3 size-6" />;
      default: return null;
    }
  };

  const createdText = pr.createdAt ? new Date(pr.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Unknown";
  const mergedText = pr.mergedAt ? new Date(pr.mergedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Unknown";
  const closedText = pr.closedAt ? new Date(pr.closedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Unknown";

  const isClosedPR = pr.state === "closed";
  const isMergedPR = Boolean(pr.mergedAt);

  return (
    <Card padding="lg" radius={0} className="border-t-2 border-gray-400" onClick={onSelect}>
      <div className="grid grid-cols-[1fr_0.5fr_2fr_2fr] gap-2">
        <Text fw={700} size="xl">
          <span className="px-2 py-1.5 rounded text-sm lg:text-lg text-white shadow-md" style={{ backgroundColor: "#805AD5" }}>
            #{pr.number}
          </span>
        </Text>

        <div>{actionIcon()}</div>

        <div className="mx-auto text-left max-w-lg">
          <Text fw={700}>
            <a
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block overflow-hidden whitespace-nowrap text-ellipsis max-w-[50vw] sm:max-w-[70vw]"
            >
              {pr.title}
            </a>
          </Text>

          <div className="text-md" style={{ color: "#2D3748" }}>Opened by: @{pr.author ?? "Unknown"} . {createdText}</div>
          {!isClosedPR && <div className="text-md" style={{ color: "#2D3748" }}>Last Action: {pr.lastAction} by @{pr.lastActionUser ?? "Unknown"}</div>}
          {isClosedPR && isMergedPR && <div className="text-md" style={{ color: "#2D3748" }}>Merged: {mergedText}</div>}
          {isClosedPR && !isMergedPR && <div className="text-md" style={{ color: "#2D3748" }}>Closed without merged: {closedText}</div>}
        </div>

        <div className="justify-self-end" style={{ color: "#2D3748" }}>
          Reviewers:
          {pr.requested_reviewers && pr.requested_reviewers.length > 0 ? (
            <div className="ml-2">{pr.requested_reviewers.map((name) => <div key={name}>@{name}</div>)}</div>
          ) : (
            <div>None</div>
          )}
        </div>
      </div>
    </Card>
  );
}
