# यूजर रजिस्टर करें
curl -X POST https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpassword123"}'

# लॉगिन करें और JWT टोकन लें
curl -X POST https://5491b775-be59-4e18-9b88-488fde3a90ba-00-191uhpbmd3ymd.pike.replit.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpassword123"}'

# NFL लाइव स्कोर एंडपॉइंट टेस्ट करें
curl -X GET http://localhost:5000/api/news/live-scores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <paste-your-jwt-token-here>"