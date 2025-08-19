import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get public IP from ipify
    const ipResponse = await fetch("https://api.ipify.org?format=json")
    const ipData = await ipResponse.json()

    // Get detailed network info from ipapi.co
    const networkResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`)
    const networkData = await networkResponse.json()

    // Get additional DNS info (using Cloudflare's DNS over HTTPS)
    const dnsResponse = await fetch("https://cloudflare-dns.com/dns-query?name=google.com&type=A", {
      headers: {
        Accept: "application/dns-json",
      },
    })
    const dnsData = await dnsResponse.json()

    return NextResponse.json({
      ip: ipData.ip,
      city: networkData.city,
      region: networkData.region,
      country: networkData.country_name,
      countryCode: networkData.country_code,
      isp: networkData.org,
      timezone: networkData.timezone,
      latitude: networkData.latitude,
      longitude: networkData.longitude,
      asn: networkData.asn,
      dns: {
        resolver: "Cloudflare (1.1.1.1)",
        responseTime: dnsData.Answer ? "Fast" : "Unknown",
      },
    })
  } catch (error) {
    console.error("Network info error:", error)
    return NextResponse.json({ error: "Failed to fetch network information" }, { status: 500 })
  }
}
