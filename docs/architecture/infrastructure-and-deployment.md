# Infrastructure and Deployment

## Infrastructure as Code

  * **Tool:** N/A for MVP (simple static hosting).
  * **Location:** N/A.
  * [cite\_start]**Approach:** Browser-based application with static file hosting[cite: 465].

## Deployment Strategy

  * [cite\_start]**Strategy:** Static site deployment to web hosting platform (Vercel, Netlify, or similar)[cite: 466].
  * [cite\_start]**Build Process:** `npm run build` (or `pnpm build`) creates optimized production bundle via Vite[cite: 466].
  * [cite\_start]**CI/CD Platform:** GitHub Actions recommended for automated builds, tests, and deployments[cite: 466].
  * [cite\_start]**Pipeline Configuration:** Build on push to main → Run tests → Deploy to production[cite: 466].

## Environments

  * [cite\_start]**Development:** Local development server via `pnpm dev` (Vite dev server with HMR)[cite: 467].
  * [cite\_start]**Preview:** Preview deployments for pull requests (via hosting platform)[cite: 467].
  * [cite\_start]**Production:** Deployed static site accessible via HTTPS URL[cite: 467].

## Environment Promotion Flow

  * [cite\_start]Development (local) → Preview (PR deployments) → Production (main branch)[cite: 467].

## Rollback Strategy

  * [cite\_start]**Primary Method:** Git-based rollback (revert commit and redeploy)[cite: 468].
  * [cite\_start]**Trigger Conditions:** Critical bugs or performance issues in production[cite: 468].
  * [cite\_start]**Recovery Time Objective:** < 10 minutes (automated deployment pipeline)[cite: 468].

-----
