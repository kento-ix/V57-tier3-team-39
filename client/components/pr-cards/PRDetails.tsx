"use client";

import { Card, Text, Divider, Group, Badge } from "@mantine/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import type { PullRequest } from "@/types/pr";
import { calculateUserStats } from "@/lib/stats";
import type { UserStats } from "@/types/stats";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PRDetailsProps {
  pr: PullRequest;
  allPRs: PullRequest[];
}

export default function PRDetails({ pr, allPRs = [] }: PRDetailsProps) {
  const createdAt = new Date(pr.createdAt);
  const mergedAt = pr.mergedAt ? new Date(pr.mergedAt) : null;
  const closedAt = pr.closedAt ? new Date(pr.closedAt) : null;
  const updatedAt = new Date(pr.updatedAt);

  const mergeDuration =
    mergedAt && createdAt
      ? Math.round((mergedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;

  const prStatus =
    pr.state === "closed" ? (pr.mergedAt ? "✅ Merged" : "❌ Closed (Not Merged)") : "🟢 Open";

  const userStats: UserStats[] = calculateUserStats(allPRs);

  const authorStats = userStats.find(u => u.username === pr.author);
  const reviewerStats = userStats.filter(u =>
    pr.requested_reviewers.includes(u.username)
  );

  const formatMergeDuration = (days: number) => {
    if (days < 1) {
      const hours = Math.round(days * 24);
      return `${hours} Hours`;
    } else {
      const wholeDays = Math.floor(days);
      const hours = Math.round((days - wholeDays) * 24);
      return hours > 0 ? `${wholeDays} Day ${hours} Hours` : `${wholeDays} Day`;
    }
  };

  const renderStarRating = (score: number) => {
    const normalized = Math.min(Math.max(Math.round(score), 1), 5);
    const fullStars = "★".repeat(normalized);
    const emptyStars = "☆".repeat(5 - normalized);
    const labels = ["Beginner", "Contributor", "Active", "Strong", "Exceptional"];
    const label = labels[normalized - 1];

    return (
      <span>
        <span style={{ color: "#f5b301", fontSize: "1.1rem" }}>{fullStars}</span>
        <span style={{ color: "#ccc", fontSize: "1.1rem" }}>{emptyStars}</span>
        <span style={{ marginLeft: 8, color: "#555", fontSize: "0.9rem" }}>
          ({label})
        </span>
      </span>
    );
  };

  return (
    <Card padding="lg" radius="md" shadow="sm">
      {/* PR Header */}
      <Group align="center" mb="sm">
        <Text fw={700} size="xl" className="text-blue-600">
          #{pr.number}: {pr.title}
        </Text>
        <Badge color={pr.mergedAt ? "green" : pr.state === "closed" ? "red" : "blue"}>
          {prStatus}
        </Badge>
      </Group>

      <Divider my="sm" />

      {/* Author & Reviewers */}
      <Group mb="sm">
        <Text size="md"><strong>Author:</strong> @{pr.author}</Text>
        <Text size="md">
          <strong>Reviewers:</strong>{" "}
          {pr.requested_reviewers.length > 0 ? pr.requested_reviewers.join(", ") : "None"}
        </Text>
      </Group>

      {/* Dates */}
      <Group mb="sm">
        <Text size="sm"><strong>Created:</strong> {createdAt.toLocaleDateString()}</Text>
        <Text size="sm"><strong>Updated:</strong> {updatedAt.toLocaleDateString()}</Text>
        {mergedAt && <Text size="sm"><strong>Merged:</strong> {mergedAt.toLocaleDateString()}</Text>}
        {closedAt && <Text size="sm"><strong>Closed:</strong> {closedAt.toLocaleDateString()}</Text>}
      </Group>

      {mergeDuration !== null && (
        <Text size="md" mb="sm"><strong>⏱️ Time to Merge:</strong> {mergeDuration} days</Text>
      )}

      <Divider my="sm" />

      {/* Last Action */}
      <Text size="sm" mb="sm">
        <strong>Last Action:</strong> {pr.lastAction} {pr.lastActionUser && `by @${pr.lastActionUser}`}
      </Text>

      {/* Author Stats */}
      {authorStats && (
        <Group mb="sm" align="flex-start" style={{ flexDirection: "column" }}>
          <Text size="md" fw={600}>👤 PR作成者: {pr.author}</Text>
          <Text size="md">
            <strong>貢献スコア:</strong> {renderStarRating(authorStats.contributionScore)}
          </Text>
          <Text size="md">
            <strong>平均マージ時間:</strong> {formatMergeDuration(authorStats.avgMergeDays)}
          </Text>
        </Group>
      )}

      {/* Reviewer Stats */}
      {reviewerStats.length > 0 && (
        <Group mb="sm" align="flex-start" style={{ flexDirection: "column" }}>
          <Text size="md" fw={600}>👥 レビュー担当者</Text>
          {reviewerStats.map(r => (
            <Text key={r.username} size="md">
              <strong>@{r.username}:</strong> {renderStarRating(r.contributionScore)} / 平均マージ: {formatMergeDuration(r.avgMergeDays)}
            </Text>
          ))}
        </Group>
      )}

      <Text size="sm" mt="sm">
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
