import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { testType, size } = await request.json()

    if (testType === "download") {
      const startTime = performance.now()
      const testSize = size || 5 * 1024 * 1024 // 5MB default

      // Generate test data in chunks to simulate real download
      const chunkSize = 64 * 1024 // 64KB chunks
      const chunks = Math.ceil(testSize / chunkSize)
      let totalBytes = 0

      for (let i = 0; i < chunks; i++) {
        const currentChunkSize = Math.min(chunkSize, testSize - totalBytes)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10 + 5))
        totalBytes += currentChunkSize
      }

      const endTime = performance.now()
      const duration = (endTime - startTime) / 1000 // seconds
      const sizeInMB = totalBytes / (1024 * 1024)
      const speedMbps = (sizeInMB * 8) / duration // Convert to Mbps

      return NextResponse.json({
        type: "download",
        speed: Math.round(speedMbps * 100) / 100,
        duration: Math.round(duration * 100) / 100,
        size: Math.round(sizeInMB * 100) / 100,
        bytesTransferred: totalBytes,
      })
    }

    if (testType === "upload") {
      const startTime = performance.now()
      const testSize = size || 2 * 1024 * 1024 // 2MB default for upload

      // Simulate upload with progressive chunks
      const chunkSize = 32 * 1024 // 32KB chunks for upload
      const chunks = Math.ceil(testSize / chunkSize)
      let totalBytes = 0

      for (let i = 0; i < chunks; i++) {
        const currentChunkSize = Math.min(chunkSize, testSize - totalBytes)
        // Simulate upload delay (typically slower than download)
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 20 + 10))
        totalBytes += currentChunkSize
      }

      const endTime = performance.now()
      const duration = (endTime - startTime) / 1000
      const sizeInMB = totalBytes / (1024 * 1024)
      const speedMbps = (sizeInMB * 8) / duration

      return NextResponse.json({
        type: "upload",
        speed: Math.round(speedMbps * 100) / 100,
        duration: Math.round(duration * 100) / 100,
        size: Math.round(sizeInMB * 100) / 100,
        bytesTransferred: totalBytes,
      })
    }

    if (testType === "ping") {
      const pingResults = []
      const testUrls = [
        "https://www.google.com/favicon.ico",
        "https://www.cloudflare.com/favicon.ico",
        "https://www.github.com/favicon.ico",
      ]

      for (let i = 0; i < 5; i++) {
        const url = testUrls[i % testUrls.length]
        const startTime = performance.now()

        try {
          await fetch(url, {
            mode: "no-cors",
            cache: "no-cache",
          })
        } catch (error) {
          // Ignore CORS errors, we just want timing
        }

        const endTime = performance.now()
        pingResults.push(endTime - startTime)
      }

      const avgPing = pingResults.reduce((a, b) => a + b, 0) / pingResults.length
      const minPing = Math.min(...pingResults)
      const maxPing = Math.max(...pingResults)
      const jitter = maxPing - minPing

      return NextResponse.json({
        type: "ping",
        ping: Math.round(avgPing * 100) / 100,
        minPing: Math.round(minPing * 100) / 100,
        maxPing: Math.round(maxPing * 100) / 100,
        jitter: Math.round(jitter * 100) / 100,
        packetLoss: 0, // Simulated - in real implementation would track failed requests
      })
    }

    return NextResponse.json({ error: "Invalid test type" }, { status: 400 })
  } catch (error) {
    console.error("Speed test error:", error)
    return NextResponse.json({ error: "Speed test failed" }, { status: 500 })
  }
}
