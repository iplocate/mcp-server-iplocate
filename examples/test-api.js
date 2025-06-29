#!/usr/bin/env node

/**
 * Simple test script to demonstrate IPLocate API capabilities
 * This shows what kind of data the MCP server can retrieve
 */

async function testIPLocateAPI(ip) {
  const baseUrl = "https://iplocate.io/api/lookup";
  const url = ip ? `${baseUrl}/${ip}` : `${baseUrl}/`;

  try {
    console.log(`\nFetching data for: ${ip || 'your IP address'}`);
    console.log('='.repeat(50));

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      console.error(`Error: ${response.status} - ${error}`);
      return;
    }

    const data = await response.json();

    // Display the data in organized sections
    console.log('\n📍 LOCATION INFORMATION:');
    console.log(`IP: ${data.ip}`);
    console.log(`Country: ${data.country} (${data.country_code})`);
    console.log(`City: ${data.city || 'N/A'}`);
    console.log(`Coordinates: ${data.latitude}, ${data.longitude}`);
    console.log(`Timezone: ${data.time_zone}`);
    console.log(`Postal Code: ${data.postal_code || 'N/A'}`);

    if (data.asn) {
      console.log('\n🌐 NETWORK INFORMATION:');
      console.log(`ASN: ${data.asn.asn}`);
      console.log(`Network Name: ${data.asn.name}`);
      console.log(`Network Route: ${data.asn.route}`);
      console.log(`Domain: ${data.asn.domain || 'N/A'}`);
      console.log(`Type: ${data.asn.type}`);
    }

    if (data.privacy) {
      console.log('\n🔒 PRIVACY & SECURITY:');
      console.log(`VPN: ${data.privacy.is_vpn ? '⚠️ Yes' : '✅ No'}`);
      console.log(`Proxy: ${data.privacy.is_proxy ? '⚠️ Yes' : '✅ No'}`);
      console.log(`Tor: ${data.privacy.is_tor ? '⚠️ Yes' : '✅ No'}`);
      console.log(`Hosting: ${data.privacy.is_hosting ? 'Yes' : 'No'}`);
      console.log(`Abuser: ${data.privacy.is_abuser ? '⚠️ Yes' : '✅ No'}`);
    }

    if (data.company) {
      console.log('\n🏢 COMPANY INFORMATION:');
      console.log(`Name: ${data.company.name}`);
      console.log(`Domain: ${data.company.domain || 'N/A'}`);
      console.log(`Type: ${data.company.type}`);
    }

    if (data.abuse) {
      console.log('\n📧 ABUSE CONTACTS:');
      console.log(`Email: ${data.abuse.email || 'N/A'}`);
      console.log(`Phone: ${data.abuse.phone || 'N/A'}`);
      console.log(`Network: ${data.abuse.network || 'N/A'}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test with different IPs
async function runTests() {
  // Test with Google DNS
  await testIPLocateAPI('8.8.8.8');

  // Test with Cloudflare DNS
  await testIPLocateAPI('1.1.1.1');

  // Test with your own IP
  await testIPLocateAPI();
}

// Run tests if called directly
if (require.main === module) {
  console.log('IPLocate API Test Script');
  console.log('This demonstrates the data available through the MCP server');
  console.log('To use the MCP server: npx -y @iplocate/mcp-server\n');

  const args = process.argv.slice(2);
  if (args.length > 0) {
    // Test specific IP if provided
    testIPLocateAPI(args[0]);
  } else {
    // Run default tests
    runTests();
  }
}
