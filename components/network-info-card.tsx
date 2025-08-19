"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Server, Globe, Clock } from "lucide-react"
import type { NetworkInfo } from "@/lib/network-utils"

interface NetworkInfoCardProps {
  networkInfo: NetworkInfo | null
  isLoading: boolean
  error: string | null
}

export function NetworkInfoCard({ networkInfo, isLoading, error }: NetworkInfoCardProps) {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Server className="w-5 h-5" />
            Network Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Network Information
        </CardTitle>
        <CardDescription>Your current connection details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : networkInfo ? (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Public IP</span>
                <Badge variant="outline" className="font-mono text-sm font-medium">
                  {networkInfo.ip}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Location
                </span>
                <span className="text-sm font-medium">
                  {networkInfo.city}, {networkInfo.region}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Country</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{networkInfo.country}</span>
                  <Badge variant="secondary" className="text-xs">
                    {networkInfo.countryCode}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Server className="w-3 h-3" />
                  ISP
                </span>
                <span className="text-sm font-medium text-right max-w-[200px] truncate">{networkInfo.isp}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ASN</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {networkInfo.asn}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Timezone
                </span>
                <span className="text-sm font-medium">{networkInfo.timezone}</span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">DNS Resolver</span>
                  <span className="text-sm font-medium">{networkInfo.dns.resolver}</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
