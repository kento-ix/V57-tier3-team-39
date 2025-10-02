import { atom } from "jotai";
import type { PullRequest } from "@/types/pr";

// Common repo info
export const ownerAtom = atom("chingu-voyages");
export const repoAtom = atom("V57-tier3-team-39");
export const tokenAtom = atom("");

// Open / Closed PR state
export const openPRsAtom = atom<PullRequest[]>([]);
export const closedPRsAtom = atom<PullRequest[]>([]);

// page number
export const openPageAtom = atom(1);
export const closedPageAtom = atom(1);

// erroe state
export const openErrorAtom = atom("");
export const closedErrorAtom = atom("");
