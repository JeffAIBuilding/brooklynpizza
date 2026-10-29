import { Router, type IRouter } from "express";
import { SubmitFranchiseInquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/franchise-inquiries", (req, res): void => {
  const parsed = SubmitFranchiseInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please check your details and try again." });
    return;
  }

  res.status(503).json({
    error:
      "Email delivery is available on the Cloudflare site after Cloudflare Email Service is configured.",
  });
});

export default router;
