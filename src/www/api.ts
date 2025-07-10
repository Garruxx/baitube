import { qrEmitter } from './server';

// Store the latest data
let lastQrData: string = '';
let isConnected: boolean = false;

// Set up listeners
qrEmitter.on('qrCode', (qrData: string) => {
  lastQrData = qrData;
});

qrEmitter.on('connectionStatus', (connected: boolean) => {
  isConnected = connected;
});

// API handler for routes
export function handleApiRequest(req: any, res: any): boolean {
  if (req.url?.startsWith('/qr-data')) {
    // Send QR data
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (lastQrData) {
      res.end(`<img src="data:image/png;base64,${lastQrData}" alt="QR Code" width="256" height="256">`);
    } else {
      res.end(''); // No QR yet
    }
    return true;
  }
  
  if (req.url?.startsWith('/connection-status')) {
    // Send connection status
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ connected: isConnected }));
    return true;
  }
  
  return false; // Not an API route
}
