"use client";

import { Card, Text, Divider } from "@mantine/core";
import type { PullRequest } from "@/types/pr";

interface PRDetailsProps {
  pr: PullRequest;
}

export default function PRDetails({ pr }: PRDetailsProps) {
  const createdAt = new Date(pr.createdAt);
  const mergedAt = pr.mergedAt ? new Date(pr.mergedAt) : null;
  const closedAt = pr.closedAt ? new Date(pr.closedAt) : null;
  const updatedAt = new Date(pr.updatedAt);

  // 経過時間の計算（マージされた場合のみ）
  const mergeDuration =
    mergedAt && createdAt
      ? Math.round((mergedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;

  // PRの状態テキスト
  const prStatus = pr.state === "closed"
    ? pr.mergedAt
      ? "✅ Merged"
      : "❌ Closed (Not Merged)"
    : "🟢 Open";

  return (
    <Card padding="lg" radius="md">
      <Text fw={700} size="xl" mb="xs" className="text-blue-600">
        #{pr.number}: {pr.title}
      </Text>

      <Divider my="sm" />

      <Text size="md">
        <strong>Status:</strong> {prStatus}
      </Text>

      <Text size="md">
        <strong>Author:</strong> @{pr.author}
      </Text>

      <Text size="md">
        <strong>Reviewers:</strong>{" "}
        {pr.requested_reviewers && pr.requested_reviewers.length > 0
          ? pr.requested_reviewers.join(", ")
          : "None"}
      </Text>

      <Divider my="sm" />

      <Text size="sm">
        <strong>Created At:</strong> {createdAt.toLocaleString()}
      </Text>

      <Text size="sm">
        <strong>Last Updated:</strong> {updatedAt.toLocaleString()}
      </Text>

      {mergedAt && (
        <Text size="sm">
          <strong>Merged At:</strong> {mergedAt.toLocaleString()}
        </Text>
      )}

      {closedAt && (
        <Text size="sm">
          <strong>Closed At:</strong> {closedAt.toLocaleString()}
        </Text>
      )}

      {mergeDuration !== null && (
        <Text size="md" mt="sm">
          <strong>⏱️ Time to Merge:</strong> {mergeDuration} days
        </Text>
      )}

      <Divider my="sm" />

      <Text size="md">
        <strong>Last Action:</strong> {pr.lastAction}{" "}
        {pr.lastActionUser && `by @${pr.lastActionUser}`}
      </Text>

      <Text size="sm" mt="xs">
        <a
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 underline hover:text-purple-800"
        >
          View on GitHub →
        </a>
      </Text>
    </Card>
  );
}
