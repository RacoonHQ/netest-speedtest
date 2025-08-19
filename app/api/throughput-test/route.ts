import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { duration = 10 } = await request.json() // Default 10 second test

    const startTime = performance.now()
    const endTime = startTime + duration * 1000
    const measurements = []
    let totalBytes = 0

    // Continuous throughput measurement
    while (performance.now() < endTime) {
      const measurementStart = performance.now()

      // Simulate data transfer in 1-second intervals
      const chunkSize = 1024 * 1024 // 1MB chunks
      await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 100)) // 100-200ms

      const measurementEnd = performance.now()
      const intervalDuration = (measurementEnd - measurementStart) / 1000
      const intervalSpeedMbps = ((chunkSize / (1024 * 1024)) * 8) / intervalDuration

      measurements.push({
        timestamp: measurementEnd - startTime,
        speed: intervalSpeedMbps,
      })

      totalBytes += chunkSize
    }

    const actualDuration = (performance.now() - startTime) / 1000
    const avgThroughput = ((totalBytes / (1024 * 1024)) * 8) / actualDuration
    const speeds = measurements.map((m) => m.speed)
    const minThroughput = Math.min(...speeds)
    const maxThroughput = Math.max(...speeds)

    // Calculate stability metrics
    const variance = speeds.reduce((acc, speed) => acc + Math.pow(speed - avgThroughput, 2), 0) / speeds.length
    const standardDeviation = Math.sqrt(variance)
    const stabilityScore = Math.max(0, 100 - (standardDeviation / avgThroughput) * 100)

    return NextResponse.json({
      duration: Math.round(actualDuration * 100) / 100,
      avgThroughput: Math.round(avgThroughput * 100) / 100,
      minThroughput: Math.round(minThroughput * 100) / 100,
      maxThroughput: Math.round(maxThroughput * 100) / 100,
      stabilityScore: Math.round(stabilityScore * 100) / 100,
      measurements: measurements.map((m) => ({
        timestamp: Math.round(m.timestamp),
        speed: Math.round(m.speed * 100) / 100,
      })),
      totalDataTransferred: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
    })
  } catch (error) {
    console.error("Throughput test error:", error)
    return NextResponse.json({ error: "Throughput test failed" }, { status: 500 })
  }
}
