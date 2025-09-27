"use client";

import { Card, Text } from "@mantine/core";
import { PullRequest } from "@/types/pr";
import { FaRegCommentDots, FaRegCheckCircle, FaRegEdit } from "react-icons/fa";

interface Props {
    pr: PullRequest;
}

export default function PullRequestCard({ pr }: Props) {
    const actionIcon = () => {
        switch (pr.lastAction) {
            case "open":
                return <FaRegCheckCircle className="inline text-green-500 mx-1" />;
            case "approved":
                return <FaRegCheckCircle className="inline text-green-700 mx-1" />;
            case "commented":
                return <FaRegCommentDots className="inline text-blue-500 mx-1" />;
            case "changes_requested":
                return <FaRegEdit className="inline text-red-500 mx-1" />;
            default:
                return null;
        }
    };

    return (
        <Card padding="lg" radius={0} className="mb-4 border-t-2 border-gray-400">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <Text fw={700} size="lg">
                        <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                            #{pr.number}
                        </span>
                        {actionIcon()}
                        <a
                            href={pr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {pr.title}
                        </a>
                    </Text>

                    <Text size="sm" c="dimmed">
                        Opened by: {pr.author} on{" "}
                        {new Date(pr.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </Text>

                    <Text size="sm" c="dimmed">
                        Last Action: {pr.lastAction} ()
                    </Text>
                </div>

                <Text size="sm" c="dimmed" className="mt-2 md:mt-0">
                    Reviewers:{" "}
                    {pr.requested_reviewers.length > 0
                    ? pr.requested_reviewers.join(", ")
                    : "None"}
                </Text>
            </div>
        </Card>
    );
}
