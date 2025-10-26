"use client";

import PullRequestCardMobile from "./PullRequestCardMobile";
import PullRequestCardDesktop from "./PullRequestCardDesktop";
import { PullRequest } from "@/types/pr";

interface Props {
  pr: PullRequest;
  onSelect?: () => void;
}

export default function PullRequestCard({ pr, onSelect }: Props) {
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
