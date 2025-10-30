import type { PullRequest } from "@/types/pr";
import type { UserStats } from "@/types/stats";

export function calculateUserStats(prs: PullRequest[] = []): UserStats[] {
  const map: Record<string, UserStats> = {};

  prs.forEach(pr => {
    const author = pr.author;

    // --- PR Creatorの集計 ---
    if (!map[author]) {
      map[author] = { username: author, prCount: 0, reviewCount: 0, avgMergeDays: 0, contributionScore: 0, commitAvg: 0, reviewSpeedAvg: 0 };
    }
    map[author].prCount += 1;
    map[author].commitAvg += pr.commitCount ?? 0;

    if (pr.mergedAt) {
      const mergeDays = (new Date(pr.mergedAt).getTime() - new Date(pr.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      map[author].avgMergeDays += mergeDays;
    }

    // --- Reviewer側の集計 ---
    pr.requested_reviewers.forEach(reviewer => {
      if (!map[reviewer]) {
        map[reviewer] = { username: reviewer, prCount: 0, reviewCount: 0, avgMergeDays: 0, contributionScore: 0, commitAvg: 0, reviewSpeedAvg: 0 };
      }
      map[reviewer].reviewCount += 1;
      if (pr.firstReviewHours) {
        map[reviewer].reviewSpeedAvg += pr.firstReviewHours;
      }
    });
  });

  // 平均値・スコア計算
  return Object.values(map).map(user => {
    if (user.prCount > 0) {
      user.avgMergeDays /= user.prCount;
      user.commitAvg /= user.prCount;
    }
    if (user.reviewCount > 0) {
      user.reviewSpeedAvg /= user.reviewCount;
    }

    // 貢献スコア（PR投稿・レビュー両面から算出）
    const creatorScore = (user.prCount * 0.4 + user.commitAvg * 0.2 + (1 / (user.avgMergeDays + 1)) * 10);
    const reviewerScore = (user.reviewCount * 0.5 + (1 / (user.reviewSpeedAvg + 1)) * 20);
    user.contributionScore = (creatorScore + reviewerScore) / 2;

    return user;
  });
}
