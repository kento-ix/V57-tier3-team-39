import { Router, Request, Response } from "express";
import { fetchOpenPRs } from "../services/github";

const router = Router();

router.get("/open", async (req: Request, res: Response) => {
    const { owner, repo, token } = req.query as { owner?: string; repo?: string; token?: string };

    if (!owner || !repo) {
        return res.status(400).json({ error: "Owner and repo are required" });
    }

    try {
        const prs = await fetchOpenPRs(owner, repo, token);
        res.json(prs);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
