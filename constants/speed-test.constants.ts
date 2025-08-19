import { Wifi, Download as DownloadIcon, Upload as UploadIcon, Clock, Activity, Gauge } from "lucide-react";

export const TEST_PHASES = ["ping", "download", "upload"] as const;

// Base configuration for speed test
const BASE_CONFIG = {
  // File sizes for different test types
  fileSizes: {
    small: 1 * 1024 * 1024,    // 1MB - for quick test
    medium: 10 * 1024 * 1024,  // 10MB - standard test
    large: 50 * 1024 * 1024    // 50MB - for more accurate results
  },
  
  // Timeout settings (in milliseconds)
  timeouts: {
    ping: 10000,    // 10 seconds
    download: 60000, // 60 seconds
    upload: 60000   // 60 seconds
  },
  
  // Animation settings
  animation: {
    duration: 2000, // 2 seconds
    updateInterval: 100 // ms
  }
} as const;

// Speedometer visualization settings
const SPEEDOMETER_CONFIG = {
  // Size configuration
  size: {
    width: 200,
    height: 120,
    strokeWidth: 12,
    needleLength: 80,
    needleWidth: 4,
    circleRadius: 5
  },
  
  // Arc configuration
  arc: {
    startAngle: -135,
    endAngle: 135,
    numTicks: 5
  },
  
  // Ranges for different metrics
  ranges: {
    ping: {
      min: 0,
      max: 100,  // ms
      // Lower is better for ping
      good: 30,  // < 30ms is excellent
      ok: 60,    // 30-60ms is good
      warning: 100 // > 60ms is poor
    },
    download: {
      min: 0,
      max: 200,  // Mbps
      // Higher is better for download
      good: 100,  // > 100Mbps is excellent
      ok: 50,     // 50-100Mbps is good
      warning: 10  // < 10Mbps is poor
    },
    upload: {
      min: 0,
      max: 100,   // Mbps
      // Higher is better for upload
      good: 50,   // > 50Mbps is excellent
      ok: 20,     // 20-50Mbps is good
      warning: 5  // < 5Mbps is poor
    }
  },
  
  // Color scheme
  colors: {
    good: "#22c55e",    // green-500
    ok: "#facc15",      // yellow-400
    warning: "#ef4444", // red-500
    background: "#1e293b", // slate-800
    tick: "#94a3b8",    // slate-400
    needle: "#f8fafc"   // zinc-50
  },
  
  // Animation settings
  animation: {
    duration: 2000,
    easing: "easeOutQuart"
  }
} as const;

// UI styling configuration
const UI_CONFIG = {
  // Card styles
  card: {
    base: "p-6 rounded-2xl transition-all duration-300 backdrop-blur-sm",
    active: "border border-emerald-500/30 shadow-lg shadow-emerald-500/10",
    inactive: "border border-gray-700 hover:border-emerald-500/20 hover:bg-gray-800/70"
  },
  
  // Value display styles
  value: {
    base: "text-3xl font-bold tracking-tighter",
    ping: "text-red-400",        // Red for ping
    download: "text-emerald-400", // Emerald for download
    upload: "text-blue-400"      // Blue for upload
  },
  
  // Label styles
  label: {
    base: "text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center justify-center gap-2 mb-2",
    icon: "w-5 h-5"
  },
  
  // Unit styles
  unit: {
    base: "text-sm text-gray-400 ml-1"
  },
  
  // Status indicator styles
  status: {
    base: "text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block",
    good: "bg-emerald-500/10 text-emerald-400",
    ok: "bg-blue-500/10 text-blue-400",
    warning: "bg-red-500/10 text-red-400"
  }
} as const;

// Export combined configuration
export const SPEED_TEST_CONFIG = {
  ...BASE_CONFIG,
  speedometer: SPEEDOMETER_CONFIG,
  ui: UI_CONFIG
} as const;

export const SPEED_TEST_LABELS = {
  ping: "Ping",
  download: "Download",
  upload: "Upload"
} as const;

export const SPEED_TEST_ICONS = {
  ping: Wifi,
  download: DownloadIcon,
  upload: UploadIcon
};

export const SPEED_TEST_UNITS = {
  ping: "ms",
  download: "Mbps",
  upload: "Mbps"
} as const;

export const SPEED_TEST_COLORS = {
  ping: {
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500",
    icon: Wifi
  },
  download: {
    text: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500",
    icon: DownloadIcon
  },
  upload: {
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500",
    icon: UploadIcon
  }
} as const;
