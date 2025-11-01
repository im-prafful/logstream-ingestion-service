import { ErrorMessageMap, ParsedDataMap } from "../types/constant.types";

export const errorMessage: ErrorMessageMap = {
  information: [
    "User successfully logged in",
    "Payment processed successfully",
    "New user account created",
    "API request completed successfully",
    'Service "auth-service" started successfully',
    "New order placed",
    "File upload completed",
    "User profile updated",
    "Email dispatch successful to user",
    "Data export job finished"
  ],
  warning: [
    'Database query exceeded 500ms',
    'Deprecated API endpoint usage detected',
    'High memory usage detected (> 80%)',
    'Disk space running low on volume "/mnt/data"',
    'Failed job retry attempt (2/3)',
    'Invalid input format for field "zip_code", using default',
    'Cache miss for key "user_profile:123"',
    'Third-party API "Stripe" request timed out, retrying',
    'Request rate limit approaching for user',
    'Unrecognized field "promo_code_2" in request body, ignoring'
  ],
  error: [
    'User login failed: invalid password',
    'Payment processing failed: insufficient funds',
    'Failed to connect to database: "logstream_db"',
    'Unhandled exception: TypeError: Cannot read property "name" of null',
    'Third-party API "SendGrid" request failed with status 503',
    'File upload failed: file size exceeds 10MB limit',
    'User authentication failed: invalid JWT or expired token',
    'Required field "email" is missing from request body',
    'Failed to write to S3 bucket: "logstream-prod-assets"',
    'Email dispatch to "user@example.com" failed, adding to dead-letter queue'
  ],
  debug: [
    'Cache key "sess:xyz" set with TTL 3600',
    'Cache key "user:123" found in store',
    'Entering function "calculate_shipping_cost"',
    'Exiting function "calculate_shipping_cost"',
    'Request body received for "POST /api/v1/ingest"',
    'SQL query generated for execution: SELECT * FROM users WHERE ...',
    'Variable "user_permissions" set to ["admin", "read"]',
    'Checking user permissions for "user-123"',
    'Auth middleware check passed for "user-123"',
    'Found 15 rows in database for query "get_all_logs"'
  ]
};

export const sourceData: string[] = [
  "auth-service",
  "payment-service",
  "api-backend",
  "frontend-web",
  "redis-worker",
  "db-poller",
  "ml-clustering-pipeline",
  "ml-anomaly-pipeline",
  "email-service",
  "user-profile-service",
  "search-api",
  "inventory-manager",
  "shipping-service",
  "notification-queue",
  "data-exporter",
  "admin-dashboard",
  "mobile-gateway",
  "cron-job-runner",
  "s3-bucket-listener",
  "kafka-consumer"
];

export const parsedDataList: Record<string, string[]> = {
  'auth-service': [
    '{"event": "user_login", "user_id": "u-1024", "method": "oauth_google", "ip": "192.168.0.45"}',
    '{"event": "password_reset", "user_id": "u-998", "status": "success", "timestamp": "2025-11-01T10:24:32Z"}',
    '{"event": "token_refresh", "user_id": "u-782", "token_id": "tok_45jk98", "expires_in": 3600}',
    '{"event": "signup", "user_id": "u-1201", "referral_code": "REF-X92T", "status": "verified"}',
    '{"event": "logout", "user_id": "u-999", "session_id": "sess_a92jk3"}'
  ],

  'payment-service': [
    '{"order_id": "ord-9812xz", "user_id": "u-778", "amount_cents": 4999, "currency": "USD", "gateway": "stripe"}',
    '{"order_id": "ord-4321mn", "user_id": "u-555", "amount_cents": 12999, "currency": "EUR", "gateway": "paypal"}',
    '{"order_id": "ord-3322kl", "user_id": "u-320", "amount_cents": 2599, "currency": "INR", "gateway": "razorpay"}',
    '{"order_id": "ord-8841aa", "user_id": "u-890", "amount_cents": 8999, "currency": "USD", "gateway": "stripe"}',
    '{"order_id": "ord-1902pq", "user_id": "u-128", "amount_cents": 15000, "currency": "GBP", "gateway": "adyen"}'
  ],

  'api-backend': [
    '{"endpoint": "/v1/orders", "method": "POST", "status_code": 201, "response_time_ms": 124}',
    '{"endpoint": "/v1/users", "method": "GET", "status_code": 200, "response_time_ms": 98}',
    '{"endpoint": "/v1/auth/login", "method": "POST", "status_code": 401, "response_time_ms": 87}',
    '{"endpoint": "/v1/products", "method": "GET", "status_code": 200, "response_time_ms": 145}',
    '{"endpoint": "/v1/checkout", "method": "POST", "status_code": 500, "response_time_ms": 302}'
  ],

  'frontend-web': [
    '{"component": "UserProfileCard", "url": "/dashboard/settings", "browser": "Chrome 120.0", "error": "TypeError: Cannot read property"}',
    '{"component": "CheckoutPage", "url": "/cart/checkout", "browser": "Safari 17.1", "load_time_ms": 1320}',
    '{"component": "Navbar", "url": "/home", "browser": "Firefox 119.0", "load_time_ms": 430}',
    '{"component": "LoginModal", "url": "/auth/login", "browser": "Edge 120.1", "error": "Invalid credentials"}',
    '{"component": "ProductGrid", "url": "/shop", "browser": "Chrome 121.0", "load_time_ms": 890}'
  ],

  'redis-worker': [
    '{"queue": "email_dispatch", "job_id": "job_223x", "status": "completed", "duration_ms": 340}',
    '{"queue": "cache_warmup", "job_id": "job_778c", "status": "failed", "retries": 2}',
    '{"queue": "order_processing", "job_id": "job_556b", "status": "running", "progress": "70%"}',
    '{"queue": "report_generator", "job_id": "job_119z", "status": "completed", "duration_ms": 1120}',
    '{"queue": "notification_sender", "job_id": "job_893q", "status": "queued"}'
  ],

  'db-poller': [
    '{"table": "orders", "rows_scanned": 1024, "duration_ms": 203, "last_id": 8822}',
    '{"table": "users", "rows_scanned": 560, "duration_ms": 140, "last_id": 4912}',
    '{"table": "invoices", "rows_scanned": 120, "duration_ms": 78, "last_id": 2301}',
    '{"table": "logs", "rows_scanned": 2300, "duration_ms": 440, "last_id": 9872}',
    '{"table": "products", "rows_scanned": 875, "duration_ms": 210, "last_id": 7621}'
  ],

  'ml-clustering-pipeline': [
    '{"model": "KMeans", "clusters": 8, "runtime_sec": 14.5, "inertia": 0.0123}',
    '{"model": "DBSCAN", "eps": 0.4, "min_samples": 5, "runtime_sec": 22.8}',
    '{"model": "AgglomerativeClustering", "clusters": 6, "linkage": "ward", "runtime_sec": 18.2}',
    '{"model": "SpectralClustering", "clusters": 10, "runtime_sec": 16.1}',
    '{"model": "MiniBatchKMeans", "clusters": 12, "batch_size": 256, "runtime_sec": 9.4}'
  ],

  'ml-anomaly-pipeline': [
    '{"model": "IsolationForest", "contamination": 0.02, "detected_anomalies": 12}',
    '{"model": "OneClassSVM", "kernel": "rbf", "detected_anomalies": 8}',
    '{"model": "Autoencoder", "epochs": 30, "detected_anomalies": 10}',
    '{"model": "LOF", "neighbors": 20, "detected_anomalies": 9}',
    '{"model": "Prophet", "detected_trend_anomalies": 3}'
  ],

  'email-service': [
    '{"email_id": "eml_8890", "to": "user@domain.com", "subject": "Order Confirmation", "status": "sent"}',
    '{"email_id": "eml_5542", "to": "admin@domain.com", "subject": "Error Alert", "status": "failed"}',
    '{"email_id": "eml_3345", "to": "support@domain.com", "subject": "Ticket Received", "status": "sent"}',
    '{"email_id": "eml_9012", "to": "user2@domain.com", "subject": "Password Reset", "status": "sent"}',
    '{"email_id": "eml_1119", "to": "team@domain.com", "subject": "Daily Report", "status": "queued"}'
  ],

  'user-profile-service': [
    '{"user_id": "u-555", "field": "email", "old_value": "old@mail.com", "new_value": "new@mail.com"}',
    '{"user_id": "u-772", "field": "phone", "old_value": "+120155500", "new_value": "+120155501"}',
    '{"user_id": "u-444", "field": "address", "old_value": "NYC", "new_value": "Boston"}',
    '{"user_id": "u-111", "field": "avatar", "status": "updated"}',
    '{"user_id": "u-999", "field": "preferences", "updated_fields": ["theme", "language"]}'
  ],

  'search-api': [
    '{"query": "laptop stand", "user_id": "u-678", "results": 42, "latency_ms": 120}',
    '{"query": "wireless mouse", "user_id": "u-320", "results": 15, "latency_ms": 98}',
    '{"query": "python books", "user_id": "u-876", "results": 65, "latency_ms": 180}',
    '{"query": "gaming monitor", "user_id": "u-234", "results": 22, "latency_ms": 132}',
    '{"query": "usb hub", "user_id": "u-900", "results": 19, "latency_ms": 110}'
  ],

  'inventory-manager': [
    '{"product_id": "p-9812", "action": "stock_update", "old_qty": 12, "new_qty": 18}',
    '{"product_id": "p-1290", "action": "low_stock_alert", "threshold": 5}',
    '{"product_id": "p-7219", "action": "restocked", "added_qty": 50}',
    '{"product_id": "p-3281", "action": "depleted", "new_qty": 0}',
    '{"product_id": "p-8810", "action": "price_update", "old_price": 49.99, "new_price": 45.99}'
  ],

  'shipping-service': [
    '{"order_id": "ord-2390", "status": "dispatched", "carrier": "DHL"}',
    '{"order_id": "ord-3321", "status": "delivered", "carrier": "FedEx"}',
    '{"order_id": "ord-4452", "status": "pending_pickup", "carrier": "BlueDart"}',
    '{"order_id": "ord-7711", "status": "in_transit", "carrier": "USPS"}',
    '{"order_id": "ord-5550", "status": "returned", "carrier": "DTDC"}'
  ],

  'notification-queue': [
    '{"notification_id": "notif_9912", "type": "push", "status": "sent"}',
    '{"notification_id": "notif_4412", "type": "sms", "status": "queued"}',
    '{"notification_id": "notif_8821", "type": "email", "status": "failed"}',
    '{"notification_id": "notif_3322", "type": "push", "status": "clicked"}',
    '{"notification_id": "notif_1190", "type": "in_app", "status": "read"}'
  ],

  'data-exporter': [
    '{"job_id": "exp_112", "format": "CSV", "status": "completed", "records": 1500}',
    '{"job_id": "exp_982", "format": "JSON", "status": "failed", "error": "TimeoutError"}',
    '{"job_id": "exp_777", "format": "XLSX", "status": "running"}',
    '{"job_id": "exp_310", "format": "PARQUET", "status": "queued"}',
    '{"job_id": "exp_654", "format": "CSV", "status": "completed", "records": 890}'
  ],

  'admin-dashboard': [
    '{"action": "add_user", "admin_id": "adm_10", "target_user": "u-888"}',
    '{"action": "delete_order", "admin_id": "adm_21", "order_id": "ord-3322"}',
    '{"action": "view_logs", "admin_id": "adm_07", "entries_viewed": 120}',
    '{"action": "update_role", "admin_id": "adm_19", "user_id": "u-210", "new_role": "moderator"}',
    '{"action": "lock_account", "admin_id": "adm_23", "user_id": "u-555"}'
  ],

  'mobile-gateway': [
    '{"endpoint": "/api/v1/login", "os": "Android 14", "latency_ms": 210}',
    '{"endpoint": "/api/v1/cart", "os": "iOS 17", "latency_ms": 180}',
    '{"endpoint": "/api/v1/search", "os": "Android 13", "latency_ms": 240}',
    '{"endpoint": "/api/v1/profile", "os": "iOS 16", "latency_ms": 150}',
    '{"endpoint": "/api/v1/checkout", "os": "Android 14", "latency_ms": 310}'
  ],

  'cron-job-runner': [
    '{"job_name": "cleanup_logs", "status": "completed", "duration_sec": 14}',
    '{"job_name": "sync_inventory", "status": "running"}',
    '{"job_name": "generate_report", "status": "completed", "duration_sec": 29}',
    '{"job_name": "archive_orders", "status": "failed", "error": "FileNotFoundError"}',
    '{"job_name": "email_digest", "status": "queued"}'
  ],

  's3-bucket-listener': [
    '{"bucket": "user-uploads", "event": "object_created", "key": "avatar/u-998.png"}',
    '{"bucket": "logs", "event": "object_removed", "key": "2025/10/01/logs.txt"}',
    '{"bucket": "reports", "event": "object_created", "key": "sales/q4_2025.csv"}',
    '{"bucket": "exports", "event": "object_updated", "key": "data/export_311.json"}',
    '{"bucket": "user-uploads", "event": "object_created", "key": "docs/u-333.pdf"}'
  ],

  'kafka-consumer': [
    '{"topic": "user_activity", "partition": 2, "offset": 10234, "status": "processed"}',
    '{"topic": "order_events", "partition": 0, "offset": 12890, "status": "processed"}',
    '{"topic": "inventory_updates", "partition": 1, "offset": 7823, "status": "skipped"}',
    '{"topic": "payment_events", "partition": 3, "offset": 13900, "status": "error"}',
    '{"topic": "email_logs", "partition": 4, "offset": 9121, "status": "processed"}'
  ]
};
