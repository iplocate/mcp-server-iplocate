#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { IPLocateResponse } from "./models.js";
import { LIB_VERSION } from "./version.js";

const VERSION = LIB_VERSION;

const DISCLAIMER = 'IP geolocation cannot be used to identify a specific individual or household. It can only be used to determine an approximate location (city/postal code) of an IP address.';

// Input schema for IP address (optional)
const IPAddressSchema = {
  ip: z.string().optional().describe("IPv4 or IPv6 address to look up. If not provided, returns information about the caller's IP address.")
};

// Create MCP server
const server = new McpServer({
  name: "iplocate-server",
  version: VERSION
});

// Helper function to validate IP address format
function isValidIP(ip: string): boolean {
  // IPv4 pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 pattern (simplified)
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  if (ipv4Pattern.test(ip)) {
    // Validate IPv4 octets
    const octets = ip.split('.');
    return octets.every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }

  return ipv6Pattern.test(ip);
}

// Helper function to make API request
async function fetchIPData(ip?: string): Promise<IPLocateResponse> {
  const baseUrl = "https://iplocate.io/api/lookup";
  const apiKey = process.env.IPLOCATE_API_KEY;

  let url = ip ? `${baseUrl}/${ip}` : `${baseUrl}/`;

  // Add API key if available
  if (apiKey) {
    url += `?apikey=${apiKey}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': `mcp-server-iplocate/${VERSION}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed with status ${response.status}`;

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorMessage = errorJson.error;
        }
      } catch {
        // If not JSON, use the raw text
        if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json() as IPLocateResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch IP data: ${String(error)}`);
  }
}

// Register tool: lookup_ip_address_details
server.registerTool(
  "lookup_ip_address_details",
  {
    title: "Look up IP Address Details",
    description: "Get comprehensive information about an IP address including geolocation, network details, privacy/security information, company data, and abuse contacts. Can look up any IPv4 or IPv6 address, or your own IP if no address is provided.",
    inputSchema: IPAddressSchema
  },
  async ({ ip }) => {
    if (ip && !isValidIP(ip)) {
      return {
        content: [{
          type: "text",
          text: `Error: "${ip}" is not a valid IPv4 or IPv6 address.`
        }],
        isError: true
      };
    }

    try {
      const data = await fetchIPData(ip);

      const dataWithDisclaimer = {
        ...data,
        disclaimer: DISCLAIMER
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(dataWithDisclaimer, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Register tool: lookup_ip_address_location
server.registerTool(
  "lookup_ip_address_location",
  {
    title: "Look up IP Address Location",
    description: "Get geographic location information for an IP address including country, city, coordinates, timezone, and postal code. Can look up any IPv4 or IPv6 address, or your own IP if no address is provided.",
    inputSchema: IPAddressSchema
  },
  async ({ ip }) => {
    if (ip && !isValidIP(ip)) {
      return {
        content: [{
          type: "text",
          text: `Error: "${ip}" is not a valid IPv4 or IPv6 address.`
        }],
        isError: true
      };
    }

    try {
      const data = await fetchIPData(ip);
      const locationData = {
        ip: data.ip,
        country: data.country,
        country_code: data.country_code,
        is_eu: data.is_eu,
        city: data.city,
        continent: data.continent,
        latitude: data.latitude,
        longitude: data.longitude,
        time_zone: data.time_zone,
        postal_code: data.postal_code,
        subdivision: data.subdivision,
        currency_code: data.currency_code,
        calling_code: data.calling_code,
        disclaimer: DISCLAIMER
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(locationData, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Register tool: lookup_ip_address_privacy
server.registerTool(
  "lookup_ip_address_privacy",
  {
    title: "Look up IP Address Privacy & Security",
    description: "Get privacy and security information for an IP address including VPN, proxy, Tor, hosting, and abuse detection. Can look up any IPv4 or IPv6 address, or your own IP if no address is provided.",
    inputSchema: IPAddressSchema
  },
  async ({ ip }) => {
    if (ip && !isValidIP(ip)) {
      return {
        content: [{
          type: "text",
          text: `Error: "${ip}" is not a valid IPv4 or IPv6 address.`
        }],
        isError: true
      };
    }

    try {
      const data = await fetchIPData(ip);
      const privacyData = {
        ip: data.ip,
        privacy: data.privacy,
        hosting: data.hosting
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(privacyData, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Register tool: lookup_ip_address_network
server.registerTool(
  "lookup_ip_address_network",
  {
    title: "Look up IP Address Network (ASN)",
    description: "Get network and ASN (Autonomous System Number) information for an IP address including the network operator, route, and regional registry. Can look up any IPv4 or IPv6 address, or your own IP if no address is provided.",
    inputSchema: IPAddressSchema
  },
  async ({ ip }) => {
    if (ip && !isValidIP(ip)) {
      return {
        content: [{
          type: "text",
          text: `Error: "${ip}" is not a valid IPv4 or IPv6 address.`
        }],
        isError: true
      };
    }

    try {
      const data = await fetchIPData(ip);
      const networkData = {
        ip: data.ip,
        network: data.network,
        asn: data.asn
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(networkData, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Register tool: lookup_ip_address_company
server.registerTool(
  "lookup_ip_address_company",
  {
    title: "Look up IP Address Company",
    description: "Get company/organization information for an IP address including the company name, domain, and type of organization. Can look up any IPv4 or IPv6 address, or your own IP if no address is provided.",
    inputSchema: IPAddressSchema
  },
  async ({ ip }) => {
    if (ip && !isValidIP(ip)) {
      return {
        content: [{
          type: "text",
          text: `Error: "${ip}" is not a valid IPv4 or IPv6 address.`
        }],
        isError: true
      };
    }

    try {
      const data = await fetchIPData(ip);
      const companyData = {
        ip: data.ip,
        company: data.company
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(companyData, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Register tool: lookup_ip_address_abuse_contacts
server.registerTool(
  "lookup_ip_address_abuse_contacts",
  {
    title: "Look up IP Address Abuse Contacts",
    description: "Get abuse contact information for an IP address to report malicious activity. Includes email, phone, and address of the network administrator. Can look up any IPv4 or IPv6 address, or your own IP if no address is provided.",
    inputSchema: IPAddressSchema
  },
  async ({ ip }) => {
    if (ip && !isValidIP(ip)) {
      return {
        content: [{
          type: "text",
          text: `Error: "${ip}" is not a valid IPv4 or IPv6 address.`
        }],
        isError: true
      };
    }

    try {
      const data = await fetchIPData(ip);
      const abuseData = {
        ip: data.ip,
        abuse: data.abuse
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(abuseData, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Register prompt: check_ip_security
server.registerPrompt(
  "check_ip_security",
  {
    title: "Check IP Security Status",
    description: "Analyze an IP address for security concerns including VPN, proxy, Tor usage, and abuse history",
    argsSchema: {
      ip: z.string().describe("IPv4 or IPv6 address to analyze")
    }
  },
  ({ ip }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please analyze the security and privacy status of IP address ${ip}. Check if it's a VPN, proxy, Tor exit node, or has been flagged for abuse. Provide a detailed security assessment.`
      }
    }]
  })
);

// Register prompt: locate_ip_geographically
server.registerPrompt(
  "locate_ip_geographically",
  {
    title: "Locate IP Geographically",
    description: "Get detailed geographic information about an IP address",
    argsSchema: {
      ip: z.string().optional().describe("IPv4 or IPv6 address to locate (omit to use your own IP)")
    }
  },
  ({ ip }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: ip
          ? `Where is IP address ${ip} located? Please provide detailed geographic information including country, city, coordinates, timezone, and any other relevant location data.`
          : `Where am I located based on my current IP address? Please provide detailed geographic information.`
      }
    }]
  })
);

// Register prompt: investigate_ip_ownership
server.registerPrompt(
  "investigate_ip_ownership",
  {
    title: "Investigate IP Ownership",
    description: "Get detailed information about who owns and operates an IP address",
    argsSchema: {
      ip: z.string().describe("IPv4 or IPv6 address to investigate")
    }
  },
  ({ ip }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Who owns IP address ${ip}? Please provide information about the company, ISP, ASN details, and network information. Include abuse contact details if available.`
      }
    }]
  })
);

// Register prompt: ip_comparison
server.registerPrompt(
  "ip_comparison",
  {
    title: "Compare Two IP Addresses",
    description: "Compare geographic and network information between two IP addresses",
    argsSchema: {
      ip1: z.string().describe("First IPv4 or IPv6 address"),
      ip2: z.string().describe("Second IPv4 or IPv6 address")
    }
  },
  ({ ip1, ip2 }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please compare the following two IP addresses: ${ip1} and ${ip2}. Show their geographic locations, network operators, security status, and highlight the key differences between them.`
      }
    }]
  })
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  const apiKey = process.env.IPLOCATE_API_KEY;
  console.error("IPLocate MCP server running on stdio");
  if (apiKey) {
    console.error("Using API key from IPLOCATE_API_KEY environment variable");
  } else {
    console.error("No API key found. Set IPLOCATE_API_KEY for higher rate limits.");
  }
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
