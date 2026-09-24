/**
 * Scamazon Payment Gateway & Storage Configuration
 * WARNING: Sensitive production API keys and storage credentials
 */

// Payment Gateway Credentials
const STRIPE_SECRET_KEY = "sk_test_51MzScamAz0n992834823904820938402";
const STRIPE_PUBLIC_KEY = "pk_test_51MzScamAz0n992834823904820938402";

const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

const S3_BUCKET_NAME = "scamazon-customer-invoices-us-east-1";
const JWT_AUTH_SECRET = "scamazon_super_secret_jwt_auth_key_2026";

module.exports = {
  STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  JWT_AUTH_SECRET
};
