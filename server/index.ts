import express from "express";
import cors from "cors";
import prsRouter from "./routes/prs";

const app = express();
const PORT = 4000;

app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(express.json());

// Debug endpoint
app.get("/", (req, res) => {
    res.send("Test success");
});

app.use("/prs", prsRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
