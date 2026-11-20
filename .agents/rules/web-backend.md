---
trigger: glob
globs: "**/services/**, **/backend/**, **/src/**/*.ts"
---

# Web Backend Rules

- **MongoDB Optimization**: Use MongoDB aggregations for complex data fetching; minimize in-memory JavaScript array manipulation.
- **Error Handling**: Throw typed application errors that map to standard HTTP/GraphQL status codes.
- **Security**: Validate all incoming parameters and sanitize inputs. Never interpolate raw user strings into database queries.
