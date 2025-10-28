"use client";

import PullRequestCardMobile from "./PullRequestCardMobile";
import PullRequestCardDesktop from "./PullRequestCardDesktop";
import { PullRequest } from "@/types/pr";

interface Props {
  pr: PullRequest;
  onSelect?: () => void;
  mode?: "mobile" | "desktop";
}

export default function PullRequestCard({ pr, onSelect, mode }: Props) {
  if (mode === "mobile") {
    return <PullRequestCardMobile pr={pr} onSelect={onSelect} />;
  }
  if (mode === "desktop") {
    return <PullRequestCardDesktop pr={pr} onSelect={onSelect} />;
  }

  return (
    <div>
      <div className="lg:hidden">
        <PullRequestCardMobile pr={pr} onSelect={onSelect} />
      </div>
      <div className="hidden lg:block">
        <PullRequestCardDesktop pr={pr} onSelect={onSelect} />
      </div>
    </div>
  );
}
