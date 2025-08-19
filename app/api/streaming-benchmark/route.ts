import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { quality } = await request.json()

    // Define streaming quality benchmarks
    const benchmarks = {
      "480p": { bitrate: 1, fileSize: 5 * 1024 * 1024 }, // 1 Mbps, 5MB
      "720p": { bitrate: 3, fileSize: 15 * 1024 * 1024 }, // 3 Mbps, 15MB
      "1080p": { bitrate: 8, fileSize: 40 * 1024 * 1024 }, // 8 Mbps, 40MB
      "4K": { bitrate: 25, fileSize: 125 * 1024 * 1024 }, // 25 Mbps, 125MB
    }

    const testQuality = quality || "1080p"
    const benchmark = benchmarks[testQuality as keyof typeof benchmarks]

    if (!benchmark) {
      return NextResponse.json({ error: "Invalid quality setting" }, { status: 400 })
    }

    const startTime = performance.now()

    // Simulate streaming file download
    const chunkSize = 256 * 1024 // 256KB chunks
    const totalChunks = Math.ceil(benchmark.fileSize / chunkSize)
    let downloadedBytes = 0
    const speedSamples = []

    for (let i = 0; i < totalChunks; i++) {
      const chunkStart = performance.now()
      const currentChunkSize = Math.min(chunkSize, benchmark.fileSize - downloadedBytes)

      // Simulate network variability
      const delay = Math.random() * 50 + 20 // 20-70ms delay
      await new Promise((resolve) => setTimeout(resolve, delay))

      downloadedBytes += currentChunkSize
      const chunkEnd = performance.now()

      // Calculate instantaneous speed for this chunk
      const chunkDuration = (chunkEnd - chunkStart) / 1000
      const chunkSpeedMbps = ((currentChunkSize / (1024 * 1024)) * 8) / chunkDuration
      speedSamples.push(chunkSpeedMbps)
    }

    const endTime = performance.now()
    const totalDuration = (endTime - startTime) / 1000
    const avgSpeedMbps = ((downloadedBytes / (1024 * 1024)) * 8) / totalDuration
    const minSpeed = Math.min(...speedSamples)
    const maxSpeed = Math.max(...speedSamples)

    // Determine streaming capability
    const canStream = avgSpeedMbps >= benchmark.bitrate && minSpeed >= benchmark.bitrate * 0.8
    const bufferingRisk =
      minSpeed < benchmark.bitrate ? "High" : avgSpeedMbps < benchmark.bitrate * 1.5 ? "Medium" : "Low"

    return NextResponse.json({
      quality: testQuality,
      requiredBitrate: benchmark.bitrate,
      measuredSpeed: Math.round(avgSpeedMbps * 100) / 100,
      minSpeed: Math.round(minSpeed * 100) / 100,
      maxSpeed: Math.round(maxSpeed * 100) / 100,
      canStream,
      bufferingRisk,
      duration: Math.round(totalDuration * 100) / 100,
      fileSize: Math.round((downloadedBytes / (1024 * 1024)) * 100) / 100,
    })
  } catch (error) {
    console.error("Streaming benchmark error:", error)
    return NextResponse.json({ error: "Streaming benchmark failed" }, { status: 500 })
  }
}
