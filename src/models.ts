// Types for IPLocate API response

export interface ASNInfo {
  asn?: string;
  route?: string;
  netname?: string;
  name?: string;
  country_code?: string;
  domain?: string;
  type?: string;
  rir?: string;
}

export interface PrivacyInfo {
  is_abuser?: boolean;
  is_anonymous?: boolean;
  is_bogon?: boolean;
  is_hosting?: boolean;
  is_icloud_relay?: boolean;
  is_proxy?: boolean;
  is_tor?: boolean;
  is_vpn?: boolean;
}

export interface CompanyInfo {
  name?: string;
  domain?: string;
  country_code?: string;
  type?: string;
}

export interface HostingInfo {
  provider?: string;
  domain?: string;
  network?: string;
  region?: string;
  service?: string;
}

export interface AbuseInfo {
  address?: string | null;
  country_code?: string | null;
  email?: string | null;
  name?: string | null;
  network?: string | null;
  phone?: string | null;
}

export interface IPLocateResponse {
  ip: string;
  country?: string | null;
  country_code?: string | null;
  is_eu?: boolean;
  city?: string | null;
  continent?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  time_zone?: string | null;
  postal_code?: string | null;
  subdivision?: string | null;
  currency_code?: string | null;
  calling_code?: string | null;
  network?: string | null;
  asn?: ASNInfo | null;
  privacy?: PrivacyInfo;
  company?: CompanyInfo | null;
  hosting?: HostingInfo | null;
  abuse?: AbuseInfo | null;
}
