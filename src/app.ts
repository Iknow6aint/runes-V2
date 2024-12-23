import express from "express";
import adminRoutes from "./modules/admin/admin.routes";
import campaignRoutes from "./modules/campaign/campaign.routes";

const app = express();

app.use(express.json());

app.use("/admins", adminRoutes);
app.use("/campaigns", campaignRoutes);

export default app;
