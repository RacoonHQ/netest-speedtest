"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, Wifi, Clock, BarChart3, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type AnalyticsCardProps = {
  ping: number
  download: number
  upload: number
  jitter?: number
  packetLoss?: number
  isp?: string
}

export function AnalyticsCard({ ping, download, upload, jitter = 0, packetLoss = 0, isp = "Unknown" }: AnalyticsCardProps) {
  // Calculate connection stability score (0-100)
  const calculateStability = () => {
    // Weighted average of different metrics
    const pingScore = Math.max(0, 100 - (ping / 100) * 50) // Lower ping is better
    const jitterScore = Math.max(0, 100 - (jitter * 10)) // Lower jitter is better
    const packetLossScore = 100 - (packetLoss * 100) // Lower packet loss is better
    
    // Weighted average (ping: 40%, jitter: 30%, packetLoss: 30%)
    return Math.round((pingScore * 0.4) + (jitterScore * 0.3) + (packetLossScore * 0.3))
  }

  const stabilityScore = calculateStability()
  
  const getStabilityStatus = () => {
    if (stabilityScore >= 80) return { text: "Excellent", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" }
    if (stabilityScore >= 60) return { text: "Good", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" }
    if (stabilityScore >= 40) return { text: "Fair", color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" }
    return { text: "Poor", color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" }
  }

  const stability = getStabilityStatus()

  const getRecommendation = () => {
    if (stabilityScore >= 80) return "Your connection is excellent for all online activities including 4K streaming and video calls."
    if (stabilityScore >= 60) return "Your connection is good for HD streaming and general browsing."
    if (stabilityScore >= 40) return "Your connection may have issues with HD video. Try lowering video quality for better performance."
    return "Your connection is unstable. Try moving closer to your router or contact your ISP."
  }

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Connection Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Connection Stability</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stabilityScore}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${stability.bg} ${stability.color}`}>
                  {stability.text}
                </span>
              </div>
            </div>
            <div className="w-24 h-24 rounded-full flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={stability.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${stabilityScore * 2.51} 999`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="absolute text-xl font-bold">{stabilityScore}</span>
            </div>
          </div>
          <Progress value={stabilityScore} className="h-2" />
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="w-4 h-4" />
              <span>Ping</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold">{ping}</span>
              <span className="text-sm text-muted-foreground">ms</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {ping < 30 ? "Excellent" : ping < 60 ? "Good" : ping < 100 ? "Fair" : "Poor"}
            </div>
          </div>
          
          <div className="space-y-1 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="w-4 h-4" />
              <span>Download</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold">{download.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">Mbps</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {download > 50 ? "Very Fast" : download > 25 ? "Fast" : download > 10 ? "Good" : "Slow"}
            </div>
          </div>
          
          <div className="space-y-1 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="w-4 h-4" />
              <span>Upload</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold">{upload.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">Mbps</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {upload > 10 ? "Excellent" : upload > 5 ? "Good" : "Fair"}
            </div>
          </div>
          
          <div className="space-y-1 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Jitter</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold">{jitter.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">ms</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {jitter < 5 ? "Excellent" : jitter < 15 ? "Good" : "Poor"}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-start gap-3">
            {stabilityScore >= 60 ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h4 className="font-medium mb-1">Recommendation</h4>
              <p className="text-sm text-muted-foreground">{getRecommendation()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
