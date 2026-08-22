# Data Fetching Responsibilities

**Display components never fetch data.**
`NtpTable`, `NtpPagination`, `NtpCard` family, `NtpBreadcrumb` receive data via props and emit events. Pure presentational. No knowledge of APIs or endpoints.

**Interactive components with internal data needs may load data via injected loader.**
`NtpSelect`, `NtpMultiSelect` receive a loader function via prop. The component defines the contract (TypeScript type). The consumer provides the implementation (factory-bound to an endpoint). Component owns *when* to call. Consumer owns *how* it's fetched.

**No component knows about API endpoints, HTTP clients, or auth.**
Dependency injection is the only mechanism for data access.