import express from "express";
import multer from "multer";
import { askQuestion, processUpload } from "../controller/docController.js";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Invalid Token" });

  req.user = user;
  next();
};

router.post(
  "/upload",
  authenticateUser,
  apiLimiter,
  upload.single("file"),
  processUpload,
);
router.post("/ask", authenticateUser, apiLimiter, askQuestion);

export default router;
