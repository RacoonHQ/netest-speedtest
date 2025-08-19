export interface NetworkInfo {
  ip: string
  city: string
  region: string
  country: string
  countryCode: string
  isp: string
  timezone: string
  latitude: number
  longitude: number
  asn: string
  dns: {
    resolver: string
    responseTime: string
  }
}

export interface SpeedTestResult {
  type: "download" | "upload" | "ping"
  speed?: number
  ping?: number
  minPing?: number
  maxPing?: number
  jitter?: number
  packetLoss?: number
  duration?: number
  size?: number
  bytesTransferred?: number
}

export interface StreamingBenchmarkResult {
  quality: string
  requiredBitrate: number
  measuredSpeed: number
  minSpeed: number
  maxSpeed: number
  canStream: boolean
  bufferingRisk: "Low" | "Medium" | "High"
  duration: number
  fileSize: number
}

export interface ThroughputResult {
  duration: number
  avgThroughput: number
  minThroughput: number
  maxThroughput: number
  stabilityScore: number
  measurements: Array<{ timestamp: number; speed: number }>
  totalDataTransferred: number
}

export async function getNetworkInfo(): Promise<NetworkInfo> {
  const response = await fetch("/api/network-info")
  if (!response.ok) {
    throw new Error("Failed to fetch network info")
  }
  return response.json()
}

// Ukuran file untuk tes download/upload (dalam bytes)
const TEST_FILE_SIZES = {
  small: 1 * 1024 * 1024,    // 1MB - untuk tes cepat
  medium: 10 * 1024 * 1024,  // 10MB - untuk tes standar
  large: 50 * 1024 * 1024    // 50MB - untuk hasil yang lebih akurat
}

// Fungsi untuk mengukur ping menggunakan Google DNS
async function measurePing(): Promise<number> {
  const start = performance.now();
  try {
    const response = await fetch('https://dns.google/resolve?name=example.com', {
      method: 'GET',
      cache: 'no-store',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`DNS lookup failed with status ${response.status}`);
    }
    
    return performance.now() - start;
  } catch (error) {
    console.error('Ping test error:', error);
    throw new Error('Gagal mengukur ping. Pastikan koneksi internet Anda stabil.');
  }
}

// Fungsi untuk mengukur kecepatan download
async function measureDownload(sizeMB: number): Promise<{ speed: number; duration: number; size: number }> {
  const sizeInBytes = sizeMB * 1024 * 1024;
  const url = `https://speed.cloudflare.com/__down?bytes=${sizeInBytes}`;
  const startTime = performance.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Timeout 60 detik
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }
    
    const blob = await response.blob();
    const endTime = performance.now();
    
    const duration = (endTime - startTime) / 1000; // dalam detik
    const sizeInBits = blob.size * 8; // ukuran dalam bit
    const speedMbps = (sizeInBits / (1024 * 1024)) / duration; // Mbps
    
    return {
      speed: parseFloat(speedMbps.toFixed(2)),
      duration: parseFloat(duration.toFixed(2)),
      size: blob.size
    };
  } catch (error) {
    console.error('Download test error:', error);
    throw new Error('Gagal mengukur kecepatan download. Silakan coba lagi.');
  }
}

// Fungsi untuk mengukur kecepatan upload
async function measureUpload(sizeMB: number): Promise<{ speed: number; duration: number; size: number }> {
  const sizeInBytes = sizeMB * 1024 * 1024;
  const data = new Uint8Array(sizeInBytes);
  
  // Isi dengan data acak untuk menghindari kompresi
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  
  const startTime = performance.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Timeout 60 detik
    
    const response = await fetch('https://speed.cloudflare.com/__up', {
      method: 'POST',
      body: data,
      cache: 'no-store',
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }
    
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000; // dalam detik
    const sizeInBits = sizeInBytes * 8; // ukuran dalam bit
    const speedMbps = (sizeInBits / (1024 * 1024)) / duration; // Mbps
    
    return {
      speed: parseFloat(speedMbps.toFixed(2)),
      duration: parseFloat(duration.toFixed(2)),
      size: sizeInBytes
    };
  } catch (error) {
    console.error('Upload test error:', error);
    throw new Error('Gagal mengukur kecepatan upload. Silakan coba lagi.');
  }
}

export async function runSpeedTest(testType: "download" | "upload" | "ping", size: keyof typeof TEST_FILE_SIZES = 'medium'): Promise<SpeedTestResult> {
  const sizeMB = TEST_FILE_SIZES[size] / (1024 * 1024); // Konversi ke MB
  
  if (testType === 'ping') {
    try {
      const latency = await measurePing();
      return {
        type: 'ping',
        ping: Math.round(latency),
        minPing: Math.max(1, Math.round(latency * 0.8)),
        maxPing: Math.round(latency * 1.2),
        duration: latency / 1000,
        bytesTransferred: 0
      };
    } catch (error) {
      throw new Error('Gagal mengukur ping. Pastikan koneksi internet Anda stabil.');
    }
  }
  
  if (testType === 'download') {
    try {
      const { speed, duration, size } = await measureDownload(sizeMB);
      return {
        type: 'download',
        speed: speed,
        duration: duration,
        size: size,
        bytesTransferred: size
      };
    } catch (error) {
      // Coba dengan ukuran yang lebih kecil jika gagal
      if (size !== 'small') {
        console.log('Mencoba dengan ukuran file yang lebih kecil...');
        return runSpeedTest('download', 'small');
      }
      throw error;
    }
  }
  
  if (testType === 'upload') {
    try {
      const { speed, duration, size } = await measureUpload(sizeMB);
      return {
        type: 'upload',
        speed: speed,
        duration: duration,
        size: size,
        bytesTransferred: size
      };
    } catch (error) {
      // Coba dengan ukuran yang lebih kecil jika gagal
      if (size !== 'small') {
        console.log('Mencoba dengan ukuran file yang lebih kecil...');
        return runSpeedTest('upload', 'small');
      }
      throw error;
    }
  }
  
  throw new Error('Jenis tes tidak valid');

  throw new Error('Invalid test type');
}

export async function runStreamingBenchmark(
  quality: "480p" | "720p" | "1080p" | "4K",
): Promise<StreamingBenchmarkResult> {
  const response = await fetch("/api/streaming-benchmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quality }),
  })

  if (!response.ok) {
    throw new Error(`Streaming benchmark failed: ${response.statusText}`)
  }

  return response.json()
}

export async function runThroughputTest(duration = 10): Promise<ThroughputResult> {
  const response = await fetch("/api/throughput-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ duration }),
  })

  if (!response.ok) {
    throw new Error(`Throughput test failed: ${response.statusText}`)
  }

  return response.json()
}

export function getConnectionRating(
  downloadSpeed: number,
  uploadSpeed: number,
  ping: number,
  jitter?: number,
): {
  rating: "Poor" | "Fair" | "Good" | "Excellent"
  color: string
  description: string
  score: number
} {
  let score = 0

  // Download speed scoring (40% weight)
  if (downloadSpeed >= 100) score += 40
  else if (downloadSpeed >= 50) score += 30
  else if (downloadSpeed >= 25) score += 20
  else if (downloadSpeed >= 10) score += 10

  // Upload speed scoring (30% weight)
  if (uploadSpeed >= 20) score += 30
  else if (uploadSpeed >= 10) score += 22
  else if (uploadSpeed >= 5) score += 15
  else if (uploadSpeed >= 1) score += 8

  // Ping scoring (20% weight)
  if (ping <= 20) score += 20
  else if (ping <= 50) score += 15
  else if (ping <= 100) score += 10
  else if (ping <= 200) score += 5

  // Jitter scoring (10% weight)
  if (jitter !== undefined) {
    if (jitter <= 5) score += 10
    else if (jitter <= 15) score += 7
    else if (jitter <= 30) score += 4
    else if (jitter <= 50) score += 2
  } else {
    score += 5 // Default if jitter not provided
  }

  if (score >= 85) {
    return {
      rating: "Excellent",
      color: "text-emerald-600",
      description: "Perfect for 4K streaming, gaming, and large file transfers",
      score,
    }
  } else if (score >= 65) {
    return {
      rating: "Good",
      color: "text-emerald-500",
      description: "Great for HD streaming, video calls, and general browsing",
      score,
    }
  } else if (score >= 40) {
    return {
      rating: "Fair",
      color: "text-yellow-500",
      description: "Suitable for basic streaming and web browsing",
      score,
    }
  } else {
    return {
      rating: "Poor",
      color: "text-red-500",
      description: "May experience issues with streaming and large downloads",
      score,
    }
  }
}
