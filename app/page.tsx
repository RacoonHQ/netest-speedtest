"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NetworkInfoCard } from "@/components/network-info-card"
import { SpeedTestCard } from "@/components/speed-test-card"
import { Particles } from "@/components/Particles"
import { getNetworkInfo, type NetworkInfo } from "@/lib/network-utils"
import { Wifi, Activity, Github, Globe } from "lucide-react"
import WaveBackground from "@/components/WaveBackground"

// Removed TestResults type as it's now handled by the SpeedTestCard component;

export default function SpeedTestDashboard() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("speedtest")
  interface Location {
    lat: number;
    lng: number;
  }

  useEffect(() => {
    async function fetchNetworkInfo() {
      try {
        const info = await getNetworkInfo()
        setNetworkInfo(info)
        setIsLoading(false)
      } catch (err: unknown) {
        console.error("Network info error:", err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      }
    }

    fetchNetworkInfo()
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Particles />

      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-lg">
                <Wifi className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Netest</h1>
                <p className="text-sm text-muted-foreground">Modern Internet Speed Test</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
                <Activity className="w-3 h-3" />
                Live Testing
              </Badge>
              <Button variant="ghost" size="sm" className="gap-2">
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">RacoonHQ</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center py-12 mb-12">
          <h1 className="text-display text-foreground mb-6">
            Test Your
            <br />
            <span className="text-primary">Internet Speed</span>
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Comprehensive analysis of your internet connection with modern technology and user-friendly interface
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-10">
          {/* Left Column - 30% - Network Info & Status */}
          <div className="lg:col-span-3 space-y-6">
            {/* Network Information */}
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
              <NetworkInfoCard networkInfo={networkInfo} isLoading={isLoading} error={error} />
            </div>

            {/* Status Koneksi */}
            <Card className="bg-card/50 backdrop-blur-sm rounded-lg border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5 text-primary" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="default" className="bg-green-500/20 text-green-400 hover:bg-green-500/20">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Protocol</span>
                  <span className="text-sm font-medium">IPv4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Security</span>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    HTTPS
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Server Location</span>
                  <span className="text-sm font-medium">Jakarta, ID</span>
                </div>
              </CardContent>
            </Card>

            {/* Speed Recommendations */}
            <Card className="bg-card/50 backdrop-blur-sm rounded-lg border">
              <CardHeader>
                <CardTitle className="text-lg">Speed Recommendations</CardTitle>
                <CardDescription>Activities you can do with your speed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Web Browsing</span>
                  <Badge variant="outline" className="text-xs border-primary/30">
                    1+ Mbps
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HD Streaming</span>
                  <Badge variant="outline" className="text-xs border-primary/30">
                    5+ Mbps
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">4K Streaming</span>
                  <Badge variant="outline" className="text-xs border-primary/30">
                    25+ Mbps
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Online Gaming</span>
                  <Badge variant="outline" className="text-xs border-primary/30">
                    3+ Mbps
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Video Conferencing</span>
                  <Badge variant="outline" className="text-xs border-primary/30">
                    1.5+ Mbps
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 70% - Test Results */}
          <div className="lg:col-span-7 space-y-6">

            {/* Test Results Tabs */}
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pb-6 pt-2">
                  <TabsContent value="speedtest" className="space-y-6 mt-0">
                    <SpeedTestCard />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Test Information</CardTitle>
              <CardDescription>Understanding your test results</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Download Speed
                </h4>
                <p className="text-sm text-muted-foreground">
                  Measures how fast data is downloaded to your device. Higher is better for streaming and browsing.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Upload Speed
                </h4>
                <p className="text-sm text-muted-foreground">
                  Measures how fast data is uploaded from your device. Important for video calls and file sharing.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  Ping & Jitter
                </h4>
                <p className="text-sm text-muted-foreground">
                  Ping measures response time. Jitter measures consistency. Lower is better for gaming and video calls.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-md mt-12 overflow-hidden">
        <WaveBackground />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                  <Wifi className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Netest</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Modern internet speed test platform with cutting-edge technology to comprehensively analyze your connection performance.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Github className="w-4 h-4" />
                <span>Open Source Project</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Internet Speed Test</li>
                <li>Streaming Benchmark</li>
                <li>Gaming Performance</li>
                <li>In-depth Analytics</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>FAQ</li>
                <li>Contact</li>
                <li>Report a Bug</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Developer</h4>
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
                  <Github className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">RacoonHQ</div>
                  <div className="text-xs text-muted-foreground">Lead Developer</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Developed with passion to provide the best experience in analyzing internet connections.
              </p>
            </div>
          </div>

          <Separator className="my-8 bg-border/50" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>© 2024 RacoonHQ. All rights reserved.</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Built with Next.js & TailwindCSS</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                <span>Powered by modern web tech</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
