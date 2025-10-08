"use client";
import { useAtom } from "jotai";
import { ownerAtom, repoAtom, tokenAtom } from "@/atoms/prAtoms";
import { Text } from "@mantine/core";

interface Props {
    onFetch: () => void;
}

export default function RepoSettingsForm({ onFetch }: Props) {
    const [owner, setOwner] = useAtom(ownerAtom);
    const [repo, setRepo] = useAtom(repoAtom);
    const [token, setToken] = useAtom(tokenAtom);

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
                        placeholder="e.g... facebook"
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
                        placeholder="e.g... react"
                        style={{ fontSize: "20px" }}
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
                    style={{ fontSize: "20px" }}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
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
            </div>
        </div>
    );
}
