# MCP Server for IP address geolocation and network data from IPLocate.io

An MCP (Model Context Protocol) server for [IPLocate.io](https://iplocate.io) - providing comprehensive IP address intelligence including geolocation, network information, privacy detection, and abuse contacts.

<a href="https://glama.ai/mcp/servers/@iplocate/mcp-server-iplocate">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@iplocate/mcp-server-iplocate/badge" alt="IPLocate MCP server" />
</a>

## Features

This MCP server provides tools to look up detailed information about IP addresses:

- **Geolocation**: Country, city, coordinates, timezone, postal code and more
- **Network Information**: ASN name, number, type, network range, ISP information
- **Privacy & Security**: VPN detection, proxy detection, Tor exit nodes, hosting providers
- **Company Data**: Organization name, domain, business type
- **Abuse Contacts**: Email, phone, and address for reporting malicious activity

## Requirements

To follow our quick start setup instructions, you will need:

- Node.js 18 or higher
- npm
- A compatible MCP client. For example, Cursor, Claude Desktop.

## Quick Start

The easiest way to use this MCP server is through your MCP client. Simply configure your client with the setup instructions below:

### Configure your MCP client

<details>
<summary><strong>Cursor</strong></summary>

One-click setup:

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=iplocate&config=eyJjb21tYW5kIjoibnB4IC15IEBpcGxvY2F0ZS9tY3Atc2VydmVyIiwiZW52Ijp7IklQTE9DQVRFX0FQSV9LRVkiOiIifX0%3D)

Manual configuration:

1. In your project directory, create the configuration:

   ```bash
   mkdir -p .cursor
   touch .cursor/mcp.json
   ```

2. Add the following to `.cursor/mcp.json`:

   ```json
   {
     "mcpServers": {
       "iplocate": {
         "command": "npx",
         "args": ["-y", "@iplocate/mcp-server"],
         "env": {
           "IPLOCATE_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

   Replace `your_api_key_here` with your actual API key from [IPLocate.io](https://iplocate.io/signup).

</details>

<details>
<summary><strong>Claude Desktop</strong></summary>

1. Open Claude Desktop settings
   - On macOS: `Cmd + ,`
   - On Windows: `Ctrl + ,`

2. Go to the "Developer" tab and click "Edit Config"

3. Add the IPLocate server configuration:

   ```json
   {
     "mcpServers": {
       "iplocate": {
         "command": "npx",
         "args": ["-y", "@iplocate/mcp-server"],
         "env": {
           "IPLOCATE_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

   Replace `your_api_key_here` with your actual API key from [IPLocate.io](https://iplocate.io/signup).

</details>

<details>
<summary><strong>VS Code (Preview)</strong></summary>

1. Create the VS Code MCP configuration:

   ```bash
   mkdir -p .vscode
   touch .vscode/mcp.json
   ```

2. Add the following to `.vscode/mcp.json`:

   ```json
   {
     "servers": {
       "iplocate": {
         "type": "stdio",
         "command": "npx",
         "args": ["-y", "@iplocate/mcp-server"],
         "env": {
           "IPLOCATE_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

   Replace `your_api_key_here` with your actual API key from [IPLocate.io](https://iplocate.io/signup).

</details>

### Available tools

The server provides the following tools:

#### `lookup_ip_address_details`

Get comprehensive information about an IP address including all available data.

**Parameters:**

- `ip` (optional): IPv4 or IPv6 address to look up. If not provided, returns information about the caller's IP address.

**Example:**

```json
{
  "ip": "8.8.8.8"
}
```

**Returns:** All available data about the IP address, including geolocation, network information, privacy, and company data.

#### `lookup_ip_address_location`

Get geographic location information for an IP address.

**Parameters:**

- `ip` (optional): IPv4 or IPv6 address to look up.

**Returns:** Country, city, coordinates, timezone, postal code, and more.

#### `lookup_ip_address_privacy`

Check whether an IP address is detected as a VPN, proxy, other anonymizing service; is on an abuse blocklist; or is a hosting provider.

**Parameters:**

- `ip` (optional): IPv4 or IPv6 address to look up.

**Returns:** VPN status, proxy detection, Tor exit node status, hosting provider information.

#### `lookup_ip_address_network`

Get network and ASN (Autonomous System Number) information for an IP address.

**Parameters:**

- `ip` (optional): IPv4 or IPv6 address to look up.

**Returns:** ASN details, network range, ISP information, regional registry.

#### `lookup_ip_address_company`

Get company/organization information for an IP address.

**Parameters:**

- `ip` (optional): IPv4 or IPv6 address to look up.

**Returns:** Company name, domain, country, organization type.

#### `lookup_ip_address_abuse_contacts`

Get abuse contact information for an IP address to report malicious activity.

**Parameters:**

- `ip` (optional): IPv4 or IPv6 address to look up.

**Returns:** Abuse contact email, phone, address, and network range.

### Available prompts

The server also provides pre-configured prompts to help with common IP analysis tasks:

#### `check_ip_security`

Analyze an IP address for security concerns including VPN, proxy, Tor usage, and abuse history.

**Example usage:** "Use the check_ip_security prompt to analyze 192.168.1.1"

#### `locate_ip_geographically`

Get detailed geographic information about an IP address.

**Example usage:** "Use the locate_ip_geographically prompt to find where I am"

#### `investigate_ip_ownership`

Get detailed information about who owns and operates an IP address.

**Example usage:** "Use the investigate_ip_ownership prompt to check who owns 8.8.8.8"

#### `ip_comparison`

Compare geographic and network information between two IP addresses.

**Example usage:** "Use the ip_comparison prompt to compare 1.1.1.1 and 8.8.8.8"

## Add your API key

You can make up to 50 requests per day without an API key.

Sign up for a free API key at [IPLocate.io](https://iplocate.io/signup) to increase your free quota to **1,000 requests per day**.

### Sign up for a free API key

1. Visit [https://iplocate.io/signup](https://iplocate.io/signup)
2. Create a free account
3. Get your API key from the dashboard

### Using an API key with this server

The server automatically reads your API key from the `IPLOCATE_API_KEY` environment variable. Configure it in your MCP client settings (see the configuration examples above) or set it when running manually.

## Running the server manually

If you need to run the server manually (for development or testing), you have several options:

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Using npx (recommended)

```bash
npx -y @iplocate/mcp-server
```

With API key:

**On macOS/Linux:**

```bash
export IPLOCATE_API_KEY=your_api_key_here
npx -y @iplocate/mcp-server
```

**On Windows:**

```powershell
set IPLOCATE_API_KEY=your_api_key_here
npx -y @iplocate/mcp-server
```

### Install from npm

```bash
npm install -g @iplocate/mcp-server
mcp-server-iplocate
```

### Install from source

```bash
git clone https://github.com/iplocate/mcp-server-iplocate.git
cd mcp-server-iplocate
yarn install
yarn build
yarn start
```

For development with auto-reload:

```bash
yarn dev
```

### Testing

You can test the server using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## API Response Format

The IPLocate API returns comprehensive data about IP addresses. Here's an example response structure:

```json
{
  "ip": "8.8.8.8",
  "country": "United States",
  "country_code": "US",
  "city": "Mountain View",
  "latitude": 37.386,
  "longitude": -122.0838,
  "asn": {
    "asn": "AS15169",
    "name": "Google LLC",
    "domain": "google.com"
  },
  "privacy": {
    "is_vpn": false,
    "is_proxy": false,
    "is_tor": false,
    "is_hosting": true
  }
  // ... and more fields
}
```

For full details, see the [IPLocate API documentation](https://iplocate.io/docs).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- For issues with this MCP server, please open an issue on GitHub
- For IPLocate API support, contact <support@iplocate.io>
- For IPLocate API documentation, visit [https://iplocate.io/docs](https://iplocate.io/docs)

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io) for the MCP specification
- [Anthropic](https://anthropic.com) for the MCP TypeScript SDK

## About IPLocate.io

Since 2017, IPLocate has set out to provide the most reliable and accurate IP address data.

We process 50TB+ of data to produce our comprehensive IP geolocation, IP to company, proxy and VPN detection, hosting detection, ASN, and WHOIS data sets. Our API handles over 15 billion requests a month for thousands of businesses and developers.

- Email: [support@iplocate.io](mailto:support@iplocate.io)
- Website: [iplocate.io](https://iplocate.io)
- Documentation: [iplocate.io/docs](https://iplocate.io/docs)
- Sign up for a free API Key: [iplocate.io/signup](https://iplocate.io/signup)