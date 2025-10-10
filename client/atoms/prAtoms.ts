import { atom } from "jotai";
import type { PullRequest } from "@/types/pr";

// Common repo info
export const ownerAtom = atom("");
export const repoAtom = atom("");
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
