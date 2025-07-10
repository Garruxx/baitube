import { startServer, updateQR, updateConnectionStatus } from './server';

// Export main functions
export { 
  startServer, 
  updateQR, 
  updateConnectionStatus 
};

// // Auto-start server when imported
// startServer();

// For manual initialization
export default {
  startServer,
  updateQR,
  updateConnectionStatus
};
