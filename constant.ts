export const errorMessage: Record<string, string[]> = {
information: [
    'User successfully logged in',
    'Payment processed successfully',
    'New user account created',
    'API request completed successfully',
    'Service "auth-service" started successfully',
    'New order placed',
    'File upload completed',
    'User profile updated',
    'Email dispatch successful to user',
    'Data export job finished',
    'Scheduled background task executed successfully',
    'Cache warmed up for frequently accessed keys',
    'Notification sent to admin team',
    'Report generated and stored in S3 bucket',
    'Session restored successfully from Redis',
    'Configuration file loaded without errors',
    'New API key generated for service account',
    'User preferences saved successfully',
    'Health check ping responded with status 200',
    'Metrics pushed to Prometheus endpoint'
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
    'Unrecognized field "promo_code_2" in request body, ignoring',
    'Network latency above expected threshold (200ms)',
    'Log buffer nearly full, consider rotating logs',
    'SSL certificate will expire in 7 days',
    'Service response time degradation detected',
    'Background worker nearing timeout threshold',
    'Low number of available threads in thread pool',
    'Retrying message delivery to Kafka topic',
    'Backup process took longer than expected',
    'Unverified email domain detected for user signup',
    'Partial failure in batch operation, continuing with remaining records'
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
    'Email dispatch to "user@example.com" failed, adding to dead-letter queue',
    'Timeout occurred while waiting for Redis response',
    'Service "payment-service" crashed due to unhandled exception',
    'Disk write operation failed: I/O error',
    'Message queue consumer stopped unexpectedly',
    'Data migration job aborted due to schema mismatch',
    'Configuration value missing for environment variable "DB_URL"',
    'Failed to parse JSON payload from external API',
    'OutOfMemoryError encountered in background worker',
    'Access denied for user attempting unauthorized endpoint',
    'Transaction rollback triggered due to integrity constraint violation'
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
    'Found 15 rows in database for query "get_all_logs"',
    'Retrying API call after initial timeout (attempt 2)',
    'Computed hash for payload verification',
    'Starting batch process for 500 records',
    'Temporary directory "/tmp/upload_123" created',
    'Initialized connection pool with 10 clients',
    'Serializing object before sending over network',
    'Deserialized response from service "inventory-manager"',
    'Performance trace: function "generateReport" took 230ms',
    'Thread sleep invoked for backoff retry',
    'Temporary cache entry invalidated after condition check'
  ]
};

export const sourceData: string[] = [
  'auth-service',
  'payment-service',
  'api-backend',
  'frontend-web',
  'redis-worker',
  'db-poller',
  'ml-clustering-pipeline',
  'ml-anomaly-pipeline',
  'email-service',
  'user-profile-service',
  'search-api',
  'inventory-manager',
  'shipping-service',
  'notification-queue',
  'data-exporter',
  'admin-dashboard',
  'mobile-gateway',
  'cron-job-runner',
  's3-bucket-listener',
  'kafka-consumer'
];

export const parsedDataList: Record<string, string[]> = {
  'auth-service': [
  '{"event": "user_login", "user_id": "u-1024", "method": "oauth_google", "ip": "192.168.0.45"}',
  '{"event": "password_reset", "user_id": "u-998", "status": "success", "timestamp": "2025-11-01T10:24:32Z"}',
  '{"event": "token_refresh", "user_id": "u-782", "token_id": "tok_45jk98", "expires_in": 3600}',
  '{"event": "signup", "user_id": "u-1201", "referral_code": "REF-X92T", "status": "verified"}',
  '{"event": "logout", "user_id": "u-999", "session_id": "sess_a92jk3"}',
  '{"event": "2fa_challenge", "user_id": "u-1234", "status": "passed", "method": "sms"}',
  '{"event": "user_login", "user_id": "u-222", "method": "oauth_github", "ip": "10.0.0.11"}',
  '{"event": "password_reset_request", "user_id": "u-901", "email": "user901@mail.com"}',
  '{"event": "email_verification", "user_id": "u-808", "status": "pending"}',
  '{"event": "token_revoked", "user_id": "u-777", "token_id": "tok_33xy21"}',
  '{"event": "account_locked", "user_id": "u-900", "reason": "too_many_attempts"}',
  '{"event": "login_attempt", "user_id": "u-321", "status": "failed", "ip": "172.16.0.99"}',
  '{"event": "session_timeout", "user_id": "u-555", "duration_min": 30}',
  '{"event": "signup", "user_id": "u-456", "referral_code": null, "status": "pending"}',
  '{"event": "token_refresh", "user_id": "u-892", "token_id": "tok_77pp10", "expires_in": 7200}'
],

'payment-service': [
  '{"order_id": "ord-9812xz", "user_id": "u-778", "amount_cents": 4999, "currency": "USD", "gateway": "stripe"}',
  '{"order_id": "ord-4321mn", "user_id": "u-555", "amount_cents": 12999, "currency": "EUR", "gateway": "paypal"}',
  '{"order_id": "ord-3322kl", "user_id": "u-320", "amount_cents": 2599, "currency": "INR", "gateway": "razorpay"}',
  '{"order_id": "ord-8841aa", "user_id": "u-890", "amount_cents": 8999, "currency": "USD", "gateway": "stripe"}',
  '{"order_id": "ord-1902pq", "user_id": "u-128", "amount_cents": 15000, "currency": "GBP", "gateway": "adyen"}',
  '{"order_id": "ord-2201zz", "user_id": "u-231", "amount_cents": 7500, "currency": "USD", "gateway": "stripe", "status": "success"}',
  '{"order_id": "ord-4410ab", "user_id": "u-650", "amount_cents": 2400, "currency": "EUR", "gateway": "paypal", "status": "pending"}',
  '{"order_id": "ord-5512xx", "user_id": "u-982", "amount_cents": 9900, "currency": "INR", "gateway": "razorpay", "status": "failed"}',
  '{"order_id": "ord-6709mn", "user_id": "u-318", "amount_cents": 10999, "currency": "USD", "gateway": "adyen", "status": "success"}',
  '{"order_id": "ord-7123qp", "user_id": "u-729", "amount_cents": 3000, "currency": "GBP", "gateway": "paypal", "status": "refunded"}',
  '{"order_id": "ord-8922ty", "user_id": "u-999", "amount_cents": 12000, "currency": "USD", "gateway": "stripe", "status": "chargeback"}',
  '{"order_id": "ord-9110kl", "user_id": "u-457", "amount_cents": 5999, "currency": "EUR", "gateway": "adyen", "status": "success"}',
  '{"order_id": "ord-9922lo", "user_id": "u-642", "amount_cents": 4550, "currency": "USD", "gateway": "paypal", "status": "success"}',
  '{"order_id": "ord-1044cx", "user_id": "u-700", "amount_cents": 7200, "currency": "INR", "gateway": "razorpay", "status": "pending"}',
  '{"order_id": "ord-1190df", "user_id": "u-233", "amount_cents": 8400, "currency": "GBP", "gateway": "stripe", "status": "success"}'
],


 'api-backend': [
  // existing 5 unchanged
  '{"endpoint": "/v1/orders", "method": "POST", "status_code": 201, "response_time_ms": 124}',
  '{"endpoint": "/v1/users", "method": "GET", "status_code": 200, "response_time_ms": 98}',
  '{"endpoint": "/v1/auth/login", "method": "POST", "status_code": 401, "response_time_ms": 87}',
  '{"endpoint": "/v1/products", "method": "GET", "status_code": 200, "response_time_ms": 145}',
  '{"endpoint": "/v1/checkout", "method": "POST", "status_code": 500, "response_time_ms": 302}',
  '{"endpoint": "/v1/inventory", "method": "GET", "status_code": 200, "response_time_ms": 134}',
  '{"endpoint": "/v1/payments", "method": "POST", "status_code": 201, "response_time_ms": 178}',
  '{"endpoint": "/v1/auth/refresh", "method": "POST", "status_code": 200, "response_time_ms": 92}',
  '{"endpoint": "/v1/users/1234", "method": "PUT", "status_code": 204, "response_time_ms": 160}',
  '{"endpoint": "/v1/reports/sales", "method": "GET", "status_code": 200, "response_time_ms": 312}',
  '{"endpoint": "/v1/notifications", "method": "POST", "status_code": 400, "response_time_ms": 230}',
  '{"endpoint": "/v1/health", "method": "GET", "status_code": 200, "response_time_ms": 33}',
  '{"endpoint": "/v1/logs", "method": "DELETE", "status_code": 403, "response_time_ms": 76}',
  '{"endpoint": "/v1/export", "method": "POST", "status_code": 202, "response_time_ms": 189}',
  '{"endpoint": "/v1/feature-flags", "method": "GET", "status_code": 200, "response_time_ms": 97}'
],

'frontend-web': [
  // existing 5 unchanged
  '{"component": "UserProfileCard", "url": "/dashboard/settings", "browser": "Chrome 120.0", "error": "TypeError: Cannot read property"}',
  '{"component": "CheckoutPage", "url": "/cart/checkout", "browser": "Safari 17.1", "load_time_ms": 1320}',
  '{"component": "Navbar", "url": "/home", "browser": "Firefox 119.0", "load_time_ms": 430}',
  '{"component": "LoginModal", "url": "/auth/login", "browser": "Edge 120.1", "error": "Invalid credentials"}',
  '{"component": "ProductGrid", "url": "/shop", "browser": "Chrome 121.0", "load_time_ms": 890}',
  '{"component": "OrderHistory", "url": "/orders", "browser": "Chrome 121.0", "load_time_ms": 780}',
  '{"component": "SearchBar", "url": "/shop", "browser": "Firefox 119.0", "load_time_ms": 190}',
  '{"component": "CartWidget", "url": "/cart", "browser": "Edge 120.2", "load_time_ms": 560}',
  '{"component": "SettingsPage", "url": "/dashboard/settings", "browser": "Chrome 120.0", "error": "ReferenceError: theme not defined"}',
  '{"component": "ReviewSection", "url": "/product/9912", "browser": "Safari 17.2", "load_time_ms": 1120}',
  '{"component": "Wishlist", "url": "/user/wishlist", "browser": "Firefox 118.9", "load_time_ms": 950}',
  '{"component": "Footer", "url": "/home", "browser": "Chrome 121.0", "load_time_ms": 310}',
  '{"component": "Header", "url": "/home", "browser": "Edge 121.0", "load_time_ms": 400}',
  '{"component": "NotificationBanner", "url": "/dashboard", "browser": "Safari 17.1", "load_time_ms": 620}',
  '{"component": "AnalyticsTracker", "url": "/dashboard", "browser": "Chrome 122.0", "load_time_ms": 480}'
],

'redis-worker': [
  // existing 5 unchanged
  '{"queue": "email_dispatch", "job_id": "job_223x", "status": "completed", "duration_ms": 340}',
  '{"queue": "cache_warmup", "job_id": "job_778c", "status": "failed", "retries": 2}',
  '{"queue": "order_processing", "job_id": "job_556b", "status": "running", "progress": "70%"}',
  '{"queue": "report_generator", "job_id": "job_119z", "status": "completed", "duration_ms": 1120}',
  '{"queue": "notification_sender", "job_id": "job_893q", "status": "queued"}',

  // new 10 entries
  '{"queue": "email_dispatch", "job_id": "job_224x", "status": "running", "progress": "40%"}',
  '{"queue": "cache_warmup", "job_id": "job_779c", "status": "completed", "duration_ms": 290}',
  '{"queue": "order_processing", "job_id": "job_557b", "status": "failed", "retries": 3}',
  '{"queue": "report_generator", "job_id": "job_120z", "status": "queued"}',
  '{"queue": "notification_sender", "job_id": "job_894q", "status": "completed", "duration_ms": 420}',
  '{"queue": "log_cleanup", "job_id": "job_992r", "status": "completed", "duration_ms": 880}',
  '{"queue": "session_purge", "job_id": "job_667t", "status": "failed", "error": "KeyError: missing_session"}',
  '{"queue": "backup_uploader", "job_id": "job_123b", "status": "running", "progress": "65%"}',
  '{"queue": "inventory_updater", "job_id": "job_555p", "status": "completed", "duration_ms": 210}',
  '{"queue": "search_indexer", "job_id": "job_777i", "status": "queued"}'
],


  'db-poller': [
  '{"table": "orders", "rows_scanned": 1024, "duration_ms": 203, "last_id": 8822}',
  '{"table": "users", "rows_scanned": 560, "duration_ms": 140, "last_id": 4912}',
  '{"table": "invoices", "rows_scanned": 120, "duration_ms": 78, "last_id": 2301}',
  '{"table": "logs", "rows_scanned": 2300, "duration_ms": 440, "last_id": 9872}',
  '{"table": "products", "rows_scanned": 875, "duration_ms": 210, "last_id": 7621}',
  '{"table": "transactions", "rows_scanned": 1450, "duration_ms": 320, "last_id": 12091}',
  '{"table": "sessions", "rows_scanned": 780, "duration_ms": 188, "last_id": 6422}',
  '{"table": "audit_trail", "rows_scanned": 2150, "duration_ms": 501, "last_id": 9923}',
  '{"table": "shipments", "rows_scanned": 432, "duration_ms": 102, "last_id": 3104}',
  '{"table": "refunds", "rows_scanned": 260, "duration_ms": 95, "last_id": 2193}'
],

'ml-clustering-pipeline': [
  '{"model": "KMeans", "clusters": 8, "runtime_sec": 14.5, "inertia": 0.0123}',
  '{"model": "DBSCAN", "eps": 0.4, "min_samples": 5, "runtime_sec": 22.8}',
  '{"model": "AgglomerativeClustering", "clusters": 6, "linkage": "ward", "runtime_sec": 18.2}',
  '{"model": "SpectralClustering", "clusters": 10, "runtime_sec": 16.1}',
  '{"model": "MiniBatchKMeans", "clusters": 12, "batch_size": 256, "runtime_sec": 9.4}',
  '{"model": "GaussianMixture", "components": 5, "runtime_sec": 12.6, "converged": true}',
  '{"model": "Birch", "clusters": 7, "threshold": 0.5, "runtime_sec": 11.2}',
  '{"model": "OPTICS", "min_samples": 10, "max_eps": 0.6, "runtime_sec": 24.5}',
  '{"model": "MeanShift", "bandwidth": 2.3, "runtime_sec": 28.7, "clusters_found": 9}',
  '{"model": "AffinityPropagation", "damping": 0.7, "runtime_sec": 19.9, "exemplars": 6}'
],

'ml-anomaly-pipeline': [
  '{"model": "IsolationForest", "contamination": 0.02, "detected_anomalies": 12}',
  '{"model": "OneClassSVM", "kernel": "rbf", "detected_anomalies": 8}',
  '{"model": "Autoencoder", "epochs": 30, "detected_anomalies": 10}',
  '{"model": "LOF", "neighbors": 20, "detected_anomalies": 9}',
  '{"model": "Prophet", "detected_trend_anomalies": 3}',
  '{"model": "EllipticEnvelope", "contamination": 0.01, "detected_anomalies": 5}',
  '{"model": "RandomCutForest", "trees": 50, "detected_anomalies": 11, "runtime_sec": 8.3}',
  '{"model": "ARIMA", "order": [2,1,2], "forecast_anomalies": 4, "runtime_sec": 6.2}',
  '{"model": "VAE", "latent_dim": 16, "detected_anomalies": 13, "epochs": 40}',
  '{"model": "ZScoreDetector", "threshold": 3.0, "detected_anomalies": 7, "window_size": 50}'
],


  'email-service': [
  '{"email_id": "eml_8890", "to": "user@domain.com", "subject": "Order Confirmation", "status": "sent"}',
  '{"email_id": "eml_5542", "to": "admin@domain.com", "subject": "Error Alert", "status": "failed"}',
  '{"email_id": "eml_3345", "to": "support@domain.com", "subject": "Ticket Received", "status": "sent"}',
  '{"email_id": "eml_9012", "to": "user2@domain.com", "subject": "Password Reset", "status": "sent"}',
  '{"email_id": "eml_1119", "to": "team@domain.com", "subject": "Daily Report", "status": "queued"}',
  '{"email_id": "eml_6678", "to": "marketing@domain.com", "subject": "Newsletter November Edition", "status": "sent"}',
  '{"email_id": "eml_7741", "to": "customer@domain.com", "subject": "Invoice #1234", "status": "sent"}',
  '{"email_id": "eml_2203", "to": "admin@domain.com", "subject": "Server Health Alert", "status": "failed"}',
  '{"email_id": "eml_8841", "to": "sales@domain.com", "subject": "New Lead Notification", "status": "queued"}',
  '{"email_id": "eml_9920", "to": "ceo@domain.com", "subject": "Weekly Metrics Report", "status": "sent"}'
],

'user-profile-service': [
  '{"user_id": "u-555", "field": "email", "old_value": "old@mail.com", "new_value": "new@mail.com"}',
  '{"user_id": "u-772", "field": "phone", "old_value": "+120155500", "new_value": "+120155501"}',
  '{"user_id": "u-444", "field": "address", "old_value": "NYC", "new_value": "Boston"}',
  '{"user_id": "u-111", "field": "avatar", "status": "updated"}',
  '{"user_id": "u-999", "field": "preferences", "updated_fields": ["theme", "language"]}',
  '{"user_id": "u-650", "field": "bio", "old_value": "Developer", "new_value": "Senior Developer"}',
  '{"user_id": "u-321", "field": "security_question", "status": "updated"}',
  '{"user_id": "u-890", "field": "notifications", "updated_fields": ["email_alerts", "sms_alerts"]}',
  '{"user_id": "u-412", "field": "username", "old_value": "john_doe", "new_value": "john_d"}',
  '{"user_id": "u-178", "field": "linked_accounts", "updated_fields": ["github", "twitter"]}'
],

'search-api': [
  '{"query": "laptop stand", "user_id": "u-678", "results": 42, "latency_ms": 120}',
  '{"query": "wireless mouse", "user_id": "u-320", "results": 15, "latency_ms": 98}',
  '{"query": "python books", "user_id": "u-876", "results": 65, "latency_ms": 180}',
  '{"query": "gaming monitor", "user_id": "u-234", "results": 22, "latency_ms": 132}',
  '{"query": "usb hub", "user_id": "u-900", "results": 19, "latency_ms": 110}',
  '{"query": "mechanical keyboard", "user_id": "u-450", "results": 34, "latency_ms": 125}',
  '{"query": "macbook sleeve", "user_id": "u-221", "results": 27, "latency_ms": 140}',
  '{"query": "standing desk", "user_id": "u-723", "results": 18, "latency_ms": 175}',
  '{"query": "gaming chair", "user_id": "u-311", "results": 25, "latency_ms": 160}',
  '{"query": "usb-c hub", "user_id": "u-115", "results": 14, "latency_ms": 105}'
],

  'inventory-manager': [
  '{"product_id": "p-9812", "action": "stock_update", "old_qty": 12, "new_qty": 18}',
  '{"product_id": "p-1290", "action": "low_stock_alert", "threshold": 5}',
  '{"product_id": "p-7219", "action": "restocked", "added_qty": 50}',
  '{"product_id": "p-3281", "action": "depleted", "new_qty": 0}',
  '{"product_id": "p-8810", "action": "price_update", "old_price": 49.99, "new_price": 45.99}',
  '{"product_id": "p-5123", "action": "inventory_audit", "discrepancy": 2, "audited_by": "system"}',
  '{"product_id": "p-1109", "action": "category_update", "old_category": "electronics", "new_category": "accessories"}',
  '{"product_id": "p-8420", "action": "supplier_update", "old_supplier": "ABC Corp", "new_supplier": "XYZ Traders"}',
  '{"product_id": "p-7715", "action": "warehouse_transfer", "from": "WH-01", "to": "WH-03", "moved_qty": 30}',
  '{"product_id": "p-6600", "action": "product_discontinued", "reason": "low demand"}'
],

'shipping-service': [
  '{"order_id": "ord-2390", "status": "dispatched", "carrier": "DHL"}',
  '{"order_id": "ord-3321", "status": "delivered", "carrier": "FedEx"}',
  '{"order_id": "ord-4452", "status": "pending_pickup", "carrier": "BlueDart"}',
  '{"order_id": "ord-7711", "status": "in_transit", "carrier": "USPS"}',
  '{"order_id": "ord-5550", "status": "returned", "carrier": "DTDC"}',
  '{"order_id": "ord-9182", "status": "label_generated", "carrier": "Delhivery"}',
  '{"order_id": "ord-8203", "status": "customs_clearance", "region": "EU"}',
  '{"order_id": "ord-4459", "status": "delivery_failed", "reason": "address_not_found"}',
  '{"order_id": "ord-6644", "status": "re_attempt_scheduled", "next_attempt": "2025-11-03T10:00:00Z"}',
  '{"order_id": "ord-1192", "status": "delivered", "carrier": "IndiaPost", "delivered_at": "2025-11-01T15:42:00Z"}'
],

'notification-queue': [
  '{"notification_id": "notif_9912", "type": "push", "status": "sent"}',
  '{"notification_id": "notif_4412", "type": "sms", "status": "queued"}',
  '{"notification_id": "notif_8821", "type": "email", "status": "failed"}',
  '{"notification_id": "notif_3322", "type": "push", "status": "clicked"}',
  '{"notification_id": "notif_1190", "type": "in_app", "status": "read"}',
  '{"notification_id": "notif_5501", "type": "email", "status": "opened"}',
  '{"notification_id": "notif_7752", "type": "push", "status": "bounced"}',
  '{"notification_id": "notif_9933", "type": "sms", "status": "delivered"}',
  '{"notification_id": "notif_1200", "type": "in_app", "status": "dismissed"}',
  '{"notification_id": "notif_5005", "type": "push", "status": "expired"}'
]
,
'data-exporter': [
  '{"job_id": "exp_112", "format": "CSV", "status": "completed", "records": 1500}',
  '{"job_id": "exp_982", "format": "JSON", "status": "failed", "error": "TimeoutError"}',
  '{"job_id": "exp_777", "format": "XLSX", "status": "running"}',
  '{"job_id": "exp_310", "format": "PARQUET", "status": "queued"}',
  '{"job_id": "exp_654", "format": "CSV", "status": "completed", "records": 890}',
  '{"job_id": "exp_210", "format": "XML", "status": "completed", "records": 3200, "duration_ms": 4200}',
  '{"job_id": "exp_450", "format": "JSON", "status": "cancelled", "cancelled_by": "user_request"}',
  '{"job_id": "exp_809", "format": "CSV", "status": "failed", "error": "FileWriteError"}',
  '{"job_id": "exp_990", "format": "XLSX", "status": "completed", "records": 2100, "compression": "zip"}',
  '{"job_id": "exp_333", "format": "PARQUET", "status": "completed", "records": 500, "destination": "s3://exports/2025/"}'
],

'admin-dashboard': [
  '{"action": "add_user", "admin_id": "adm_10", "target_user": "u-888"}',
  '{"action": "delete_order", "admin_id": "adm_21", "order_id": "ord-3322"}',
  '{"action": "view_logs", "admin_id": "adm_07", "entries_viewed": 120}',
  '{"action": "update_role", "admin_id": "adm_19", "user_id": "u-210", "new_role": "moderator"}',
  '{"action": "lock_account", "admin_id": "adm_23", "user_id": "u-555"}',
  '{"action": "generate_report", "admin_id": "adm_02", "report_type": "sales_summary", "status": "completed"}',
  '{"action": "reset_password", "admin_id": "adm_12", "user_id": "u-300", "status": "success"}',
  '{"action": "system_backup", "admin_id": "adm_01", "status": "running"}',
  '{"action": "update_config", "admin_id": "adm_08", "config_key": "max_login_attempts", "old_value": 5, "new_value": 3}',
  '{"action": "enable_feature_flag", "admin_id": "adm_15", "flag_name": "dark_mode", "enabled": true}'
],

'mobile-gateway': [
  '{"endpoint": "/api/v1/login", "os": "Android 14", "latency_ms": 210}',
  '{"endpoint": "/api/v1/cart", "os": "iOS 17", "latency_ms": 180}',
  '{"endpoint": "/api/v1/search", "os": "Android 13", "latency_ms": 240}',
  '{"endpoint": "/api/v1/profile", "os": "iOS 16", "latency_ms": 150}',
  '{"endpoint": "/api/v1/checkout", "os": "Android 14", "latency_ms": 310}',
  '{"endpoint": "/api/v1/orders", "os": "Android 12", "latency_ms": 275, "response_code": 200}',
  '{"endpoint": "/api/v1/logout", "os": "iOS 17", "latency_ms": 140, "response_code": 204}',
  '{"endpoint": "/api/v1/offers", "os": "Android 14", "latency_ms": 190, "response_code": 200}',
  '{"endpoint": "/api/v1/support", "os": "iOS 16", "latency_ms": 360, "response_code": 500}',
  '{"endpoint": "/api/v1/notifications", "os": "Android 13", "latency_ms": 220, "response_code": 200}'
],


  'cron-job-runner': [
  '{"job_name": "cleanup_logs", "status": "completed", "duration_sec": 14}',
  '{"job_name": "sync_inventory", "status": "running"}',
  '{"job_name": "generate_report", "status": "completed", "duration_sec": 29}',
  '{"job_name": "archive_orders", "status": "failed", "error": "FileNotFoundError"}',
  '{"job_name": "email_digest", "status": "queued"}',
  '{"job_name": "refresh_caches", "status": "completed", "duration_sec": 11}',
  '{"job_name": "rotate_api_keys", "status": "completed", "duration_sec": 5}',
  '{"job_name": "cleanup_sessions", "status": "failed", "error": "PermissionDenied"}',
  '{"job_name": "sync_billing_data", "status": "running"}',
  '{"job_name": "update_exchange_rates", "status": "completed", "duration_sec": 7}'
],

's3-bucket-listener': [
  '{"bucket": "user-uploads", "event": "object_created", "key": "avatar/u-998.png"}',
  '{"bucket": "logs", "event": "object_removed", "key": "2025/10/01/logs.txt"}',
  '{"bucket": "reports", "event": "object_created", "key": "sales/q4_2025.csv"}',
  '{"bucket": "exports", "event": "object_updated", "key": "data/export_311.json"}',
  '{"bucket": "user-uploads", "event": "object_created", "key": "docs/u-333.pdf"}',
  '{"bucket": "analytics", "event": "object_created", "key": "session_data/2025_10_31.json"}',
  '{"bucket": "backups", "event": "object_restored", "key": "db_snapshot_2025_09_01.bak"}',
  '{"bucket": "logs", "event": "object_created", "key": "2025/11/01/error.log"}',
  '{"bucket": "exports", "event": "object_removed", "key": "data/archive_2024.json"}',
  '{"bucket": "user-uploads", "event": "object_updated", "key": "avatar/u-221.png"}'
],

'kafka-consumer': [
  '{"topic": "user_activity", "partition": 2, "offset": 10234, "status": "processed"}',
  '{"topic": "order_events", "partition": 0, "offset": 12890, "status": "processed"}',
  '{"topic": "inventory_updates", "partition": 1, "offset": 7823, "status": "skipped"}',
  '{"topic": "payment_events", "partition": 3, "offset": 13900, "status": "error"}',
  '{"topic": "email_logs", "partition": 4, "offset": 9121, "status": "processed"}',
  '{"topic": "shipment_updates", "partition": 2, "offset": 10011, "status": "processed"}',
  '{"topic": "audit_trail", "partition": 1, "offset": 7055, "status": "processed"}',
  '{"topic": "alerts", "partition": 0, "offset": 5098, "status": "skipped"}',
  '{"topic": "recommendations", "partition": 3, "offset": 8900, "status": "processed"}',
  '{"topic": "feedback_events", "partition": 4, "offset": 9933, "status": "processed"}'
]

};
