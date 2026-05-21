import { Company } from '@/types';
import { slugify } from '@/lib/utils';

const companyNames = [
  'Adobe', 'Airbnb', 'Amazon', 'Apple', 'Atlassian',
  'Bloomberg', 'ByteDance', 'Cisco', 'Coinbase', 'Coursera',
  'Databricks', 'DE Shaw', 'Directi', 'Disney', 'DoorDash',
  'Dropbox', 'eBay', 'Expedia', 'Facebook', 'Flipkart',
  'Goldman Sachs', 'Google', 'Grab', 'Hotstar', 'IBM',
  'Infosys', 'Intel', 'Intuit', 'Jane Street', 'LinkedIn',
  'Lyft', 'MakeMyTrip', 'Media.net', 'Meta', 'Microsoft',
  'Morgan Stanley', 'Netflix', 'Nvidia', 'Oracle', 'PayPal',
  'PhonePe', 'Pinterest', 'Qualcomm', 'Razorpay', 'Salesforce',
  'Samsung', 'ServiceNow', 'Snap', 'Spotify', 'Sprinklr',
  'Stripe', 'Swiggy', 'TCS', 'Tesla', 'ThoughtWorks',
  'TikTok', 'Tower Research', 'Twilio', 'Uber', 'Visa',
  'VMware', 'Walmart', 'Wipro', 'Yahoo', 'Yandex',
  'Zoho', 'Accenture', 'Agoda', 'Airtel', 'Akamai',
  'Booking.com', 'Box', 'Capital One', 'Cloudflare', 'Cognizant',
  'Confluent', 'Coupang', 'DataDog', 'Figma', 'GitHub',
  'HackerRank', 'HashiCorp', 'Instacart', 'Juspay', 'Klarna',
  'Meesho', 'Navi', 'Notion', 'Okta', 'OpenAI',
  'Palo Alto Networks', 'Postman', 'Quora', 'Reddit', 'Rippling',
  'Robinhood', 'Shopify', 'Slack', 'Snowflake', 'Square',
  'Topcoder', 'Twitter', 'Wix', 'Workday', 'Zendesk',
];

const companyColors: Record<string, string> = {
  'Adobe': '#FF0000', 'Airbnb': '#FF5A5F', 'Amazon': '#FF9900',
  'Apple': '#555555', 'Atlassian': '#0052CC', 'Bloomberg': '#F26522',
  'ByteDance': '#000000', 'Cisco': '#1BA0D7', 'Coinbase': '#0052FF',
  'Google': '#4285F4', 'Meta': '#0866FF', 'Microsoft': '#00A4EF',
  'Netflix': '#E50914', 'Nvidia': '#76B900', 'Spotify': '#1DB954',
  'Tesla': '#CC0000', 'Twitter': '#1DA1F2', 'Uber': '#000000',
  'LinkedIn': '#0A66C2', 'GitHub': '#181717', 'Slack': '#4A154B',
  'Stripe': '#635BFF', 'Shopify': '#96BF48', 'Snowflake': '#29B5E8',
  'Reddit': '#FF4500', 'Dropbox': '#0061FF', 'PayPal': '#003087',
  'Visa': '#1A1F71', 'Oracle': '#F80000', 'Intel': '#0071C5',
  'Samsung': '#1428A0', 'IBM': '#054ADA', 'Salesforce': '#00A1E0',
  'ServiceNow': '#61A60E', 'Qualcomm': '#3253DC', 'Pinterest': '#E60023',
  'Snap': '#FFFC00', 'Twilio': '#F22F46', 'Square': '#3E4348',
  'Lyft': '#FF00BF', 'DoorDash': '#FF3008', 'Grab': '#00B14F',
  'Flipkart': '#2874F0', 'Swiggy': '#FC8019', 'Razorpay': '#3395FF',
};

export const companies: Company[] = companyNames.map((name, index) => ({
  id: `company-${index + 1}`,
  name,
  slug: slugify(name),
  color: companyColors[name] || '#7c3aed',
}));

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

export function searchCompanies(query: string): Company[] {
  const q = query.toLowerCase().trim();
  if (!q) return companies;
  return companies.filter((c) => c.name.toLowerCase().includes(q));
}
