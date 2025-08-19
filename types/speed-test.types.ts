export type TestState = "not_started" | "testing" | "completed" | "error";
export type TestPhase = "ping" | "download" | "upload" | "complete" | null;

export interface SpeedTestCardProps {
  isTestRunning?: boolean;
  className?: string;
}

export interface AnimatedNumberProps {
  value: number;
  label?: string;
  unit?: string;
  color?: string;
  isAnimating?: boolean;
  duration?: number;
  updateInterval?: number;
}

export interface SpeedTestResult {
  ping?: number;
  jitter?: number;
  packetLoss?: number;
  speed?: number;
  progress?: number;
  type?: string;
}

export interface ServerInfo {
  name?: string;
  location?: string;
}

export interface TestResults {
  ping: SpeedTestResult;
  download: SpeedTestResult;
  upload: SpeedTestResult;
  server?: ServerInfo;
}

export interface CurrentValues {
  ping: number;
  download: number;
  upload: number;
}

export interface TestProgress {
  phase: TestPhase;
  progress: number;
}

export interface AnalyticsCardProps {
  ping: number;
  download: number;
  upload: number;
  jitter?: number;
  packetLoss?: number;
  isp?: string;
}
