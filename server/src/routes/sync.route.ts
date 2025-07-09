import { Router } from "express";
import cronService from "../services/cron.service";
import cleanupService from "../services/cleanup.service";
import httpLogger from "../services/logger.service";

const router = Router();

router.post("/orders", async (req, res) => {
  try {
    httpLogger.info("Manual order sync triggered via API");
    
    // Trigger the sync process
    await cronService.triggerOrderSync();
    
    res.status(200).json({
      success: true,
      message: "Order sync completed successfully"
    });
    
  } catch (error: any) {
    httpLogger.error("Error in manual order sync:", {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: "Order sync failed",
      error: error.message
    });
  }
});

router.post("/cleanup", async (req, res) => {
  try {
    httpLogger.info("Manual cleanup triggered via API");
    
    const result = await cronService.triggerCleanup();
    
    res.status(200).json({
      success: true,
      message: "Cleanup completed successfully",
      data: result
    });
    
  } catch (error: any) {
    httpLogger.error("Error in manual cleanup:", {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: "Cleanup failed",
      error: error.message
    });
  }
});

// Preview cleanup (dry run)
router.get("/cleanup/preview", async (req, res) => {
  try {
    httpLogger.info("Cleanup preview requested via API");
    
    const preview = await cleanupService.previewCleanup();
    
    res.status(200).json({
      success: true,
      message: "Cleanup preview generated successfully",
      data: preview
    });
    
  } catch (error: any) {
    httpLogger.error("Error in cleanup preview:", {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: "Cleanup preview failed",
      error: error.message
    });
  }
});

// Get cleanup statistics
router.get("/cleanup/stats", async (req, res) => {
  try {
    httpLogger.info("Cleanup stats requested via API");
    
    const stats = await cleanupService.getCleanupStats();
    
    res.status(200).json({
      success: true,
      message: "Cleanup statistics retrieved successfully",
      data: stats
    });
    
  } catch (error: any) {
    httpLogger.error("Error getting cleanup stats:", {
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: "Failed to get cleanup statistics",
      error: error.message
    });
  }
});

export default router; 