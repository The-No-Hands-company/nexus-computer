# Nexus Computer - Comprehensive Missing-Items Audit

Date: 2026-04-14
Scope: Repository state on branch main after commit 910477f

This is a best-effort exhaustive gap list based on code and docs in this repo.

## 1) Product parity and benchmark gaps

### AI workspace
- [ ] True long-running background agent jobs with resume after restart.
- [ ] Multi-step task planner UI with explicit plan/step states.
- [ ] Interrupt/cancel button for in-flight model responses.
- [ ] Retry from a specific failed tool step.
- [ ] Branching conversation threads.
- [ ] Conversation search.
- [ ] Conversation export/import.
- [ ] Per-message token/cost usage display.
- [ ] Structured run summary after each task.
- [ ] Built-in safety explanation for blocked tool actions.
- [ ] Attach files directly inside chat input (not only via explorer upload).
- [ ] Rich file grounding controls in chat (pin/unpin files as context).
- [ ] Audio input in chat.
- [ ] Image input in chat.
- [ ] Vision-capable message rendering/flow.
- [ ] Native markdown tables rendering.
- [ ] KaTeX/math rendering in assistant responses.
- [ ] Mermaid rendering in chat responses.
- [ ] Tool execution timeline visualization.

### File system and content support
- [ ] Folder upload.
- [ ] Drag-and-drop upload area.
- [ ] Progress bars for large uploads.
- [ ] Upload to selected directory (currently root-oriented UX).
- [ ] Rename/move files and folders from UI.
- [ ] Duplicate file action.
- [ ] Copy path action.
- [ ] Bulk operations (multi-select delete/move/download).
- [ ] Archive download for folders.
- [ ] In-app text editor with save, undo, and diff.
- [ ] Binary file preview pipeline.
- [ ] Image preview.
- [ ] PDF preview.
- [ ] Audio preview.
- [ ] Video preview.
- [ ] E-book preview.
- [ ] Large file streaming reads (instead of full read for previews).
- [ ] File metadata panel (permissions, modified time, hash).
- [ ] Trash/recycle bin with restore.
- [ ] File locking/conflict resolution.
- [ ] Git-aware file status in explorer.
- [ ] Workspace import/export bundle.
- [ ] External sync connectors (local device sync).

### Computer layer
- [ ] Interactive terminal session UI (persistent PTY, not only model-invoked subprocesses).
- [ ] Terminal tabs and named sessions.
- [ ] Streaming terminal output to UI in real time.
- [ ] Signal controls for terminal jobs (SIGINT/SIGTERM).
- [ ] Process tree inspector.
- [ ] Resource monitor (CPU/RAM/disk per service).
- [ ] Port occupancy dashboard.
- [ ] One-click app scaffolding templates.
- [ ] Built-in package manager helpers across ecosystems.
- [ ] Service dependency graph/start order.
- [ ] Reverse-proxy/routing configuration for multiple hosted apps.
- [ ] TLS certificate automation for hosted services.
- [ ] Zero-downtime restart strategy for hosted services.

### Reachability channels
- [ ] Email channel integration.
- [ ] SMS/text channel integration.
- [ ] Telegram channel integration.
- [ ] Channel identity and consent management.
- [ ] Per-channel rate and abuse controls.

### Browser and integrations
- [ ] Built-in browser panel/web automation surface.
- [ ] OAuth flow support for third-party integrations.
- [ ] Integration credential vault UI.
- [ ] Integration lifecycle management (connect/test/revoke).
- [ ] Webhook management UI.
- [ ] MCP server management and discovery in product UI.
- [ ] Plugin sandbox permissions model.
- [ ] Plugin signing and trust policy.

## 2) User control and customization gaps

- [ ] Rules management UI (policy exists, but no complete user-facing editor/workflow).
- [ ] Confirm/deny prompts for destructive commands from UI.
- [ ] Theme customization panel.
- [ ] Multiple theme packs.
- [ ] Accessibility theme modes (high contrast, reduced motion).
- [ ] Full settings export/import.
- [ ] Workspace profile presets.
- [ ] Persona version history.
- [ ] Persona sharing/import from community.
- [ ] Prompt preset marketplace/gallery.

## 3) Cloud/federation gaps

- [ ] Federation peer registry (currently placeholder peers list).
- [ ] Peer discovery protocol.
- [ ] Peer trust/onboarding flow.
- [ ] Federation key rotation lifecycle.
- [ ] Automatic reconnection and backoff strategy.
- [ ] Health dashboard for peers.
- [ ] Signed event envelopes for all cloud events.
- [ ] Cloud event pagination endpoint.
- [ ] Cloud webhook retry queue and dead-letter handling.
- [ ] Replay protection persistence beyond timestamp window.
- [ ] Key revocation workflow.
- [ ] Key rollover grace periods.
- [ ] Node secret rotation endpoint and runbook.

## 4) Security and privacy hardening gaps

- [ ] Authentication layer for all sensitive APIs.
- [ ] Authorization model (roles/scopes).
- [ ] Multi-user isolation boundaries.
- [ ] API rate limiting.
- [ ] Request body size limits across all endpoints.
- [ ] CSRF strategy for cookie-auth scenarios.
- [ ] Strict CORS policy by default (not wildcard default posture).
- [ ] Content Security Policy headers.
- [ ] HSTS header.
- [ ] Dependency vulnerability scanning.
- [ ] Secret scanning in CI.
- [ ] Audit log integrity protection (tamper-evident signatures).
- [ ] Encryption at rest option for sensitive local stores.
- [ ] Key management strategy documentation.
- [ ] Secure credential storage abstraction.
- [ ] Per-folder/project access boundaries.
- [ ] Safe command allowlist/denylist policy engine with user controls.
- [ ] Sandboxed command execution option.
- [ ] Shell command provenance metadata in ledger (who/why/context).

## 5) Reliability and data integrity gaps

- [ ] Atomic writes with fsync for all JSON stores.
- [ ] Store schema versioning and migrations.
- [ ] Corruption recovery tooling for local stores.
- [ ] Concurrency-safe write coordination across processes.
- [ ] Backup schedule automation.
- [ ] Backup retention policy manager.
- [ ] Disaster recovery validation command.
- [ ] Snapshot validation checksums.
- [ ] Snapshot diff/preview before restore.
- [ ] Partial restore (specific files/folders).
- [ ] Restore rollback safety net.

## 6) Observability and operations gaps

- [ ] Structured logging format standardization.
- [ ] Request ID correlation across logs.
- [ ] Metrics endpoint (Prometheus/OpenMetrics style).
- [ ] Tracing hooks.
- [ ] Error reporting integration.
- [ ] SLO/SLI definitions.
- [ ] Healthcheck depth levels (liveness vs readiness vs startup).
- [ ] Ops dashboard with key runtime indicators.
- [ ] Alerting hooks for failed jobs/services.
- [ ] Built-in diagnostics bundle export.

## 7) Performance and scale gaps

- [ ] Async/non-blocking execution for heavy operations.
- [ ] Backpressure controls for SSE chat streams.
- [ ] Streaming file read endpoints for large files.
- [ ] Search indexing incremental update strategy for very large workspaces.
- [ ] Search index compaction and pruning.
- [ ] Cache strategy for frequent metadata endpoints.
- [ ] Service/job execution queue limits.
- [ ] Load/performance benchmark suite.

## 8) Frontend UX and accessibility gaps

- [ ] Fully responsive mobile layout across all panels.
- [ ] Touch-first interactions for complex panels.
- [ ] Keyboard navigation coverage for all interactive controls.
- [ ] Screen-reader labels and landmark structure audit.
- [ ] Focus management consistency across modal/panels.
- [ ] Empty/error/loading states consistency pass.
- [ ] Undo affordances for destructive actions.
- [ ] Toast/notification system standardization.
- [ ] i18n/l10n framework.

## 9) API and contract maturity gaps

- [ ] API versioning strategy.
- [ ] OpenAPI curation and endpoint grouping.
- [ ] Stable error code taxonomy.
- [ ] Idempotency keys for mutation endpoints.
- [ ] Pagination standardization across list endpoints.
- [ ] Filtering/sorting standards for list endpoints.
- [ ] Consistent datetime and enum serialization policy.
- [ ] Public SDK for cloud callback signing and verification.

## 10) AI model/routing gaps

- [ ] True provider abstraction at runtime (model registry exists but routing is still limited).
- [ ] Automatic fallback across providers on failure.
- [ ] Capability-based auto-routing policy configurable from UI.
- [ ] Cost-aware model routing.
- [ ] Latency-aware routing.
- [ ] Model health monitoring and auto-disable.
- [ ] Context-window management strategy.
- [ ] Conversation summarization/memory compaction.
- [ ] Per-session model locking and replayability guarantees.

## 11) Automation and services maturity gaps

- [ ] Cron expression support (not only fixed interval).
- [ ] Timezone-aware schedules.
- [ ] Dependency chains between jobs.
- [ ] Job retries with backoff.
- [ ] Job concurrency limits.
- [ ] Secret/env injection per job.
- [ ] Service environment variable manager.
- [ ] Service restart policy customization.
- [ ] Service stdout/stderr split and retention controls.
- [ ] Service log search/filter.
- [ ] Service templates (web app, api, worker presets).

## 12) Community and ecosystem gaps

- [ ] Public-facing feature request board (outside local instance).
- [ ] Feature voting anti-abuse controls.
- [ ] Public roadmap publishing workflow.
- [ ] Changelog automation.
- [ ] Community plugin/skill submission pipeline.
- [ ] Moderation workflow for community submissions.
- [ ] Documentation site and contribution guides.

## 13) Developer experience gaps

- [ ] One-command bootstrap script for full stack.
- [ ] Dev container setup.
- [ ] Linting configuration for backend and frontend.
- [ ] Formatting configuration and scripts.
- [ ] Type-checking pipeline (Python and/or stronger JS typing).
- [ ] Pre-commit hooks with clear failure output.
- [ ] API client generation workflow.
- [ ] Seed/dev data scripts.
- [ ] Makefile/task runner shortcuts.

## 14) Testing and quality assurance gaps

- [ ] Unit tests for backend modules.
- [ ] API integration tests.
- [ ] Frontend component tests.
- [ ] End-to-end tests.
- [ ] Snapshot/restore tests.
- [ ] Cloud signature verification tests.
- [ ] Service lifecycle tests.
- [ ] Automation scheduler tests.
- [ ] Search indexing correctness tests.
- [ ] Regression suite for critical workflows.
- [ ] Coverage reporting.

## 15) CI/CD and release engineering gaps

- [ ] CI pipeline configuration.
- [ ] Automated test runs on pull requests.
- [ ] Build artifact validation.
- [ ] Container image scanning.
- [ ] Automated dependency update workflow.
- [ ] Release tagging and notes automation.
- [ ] Staging environment workflow.
- [ ] Rollback procedure automation.

## 16) Documentation and governance gaps

- [ ] License file is missing.
- [ ] Architecture decision records.
- [ ] Threat model document.
- [ ] Security policy and disclosure process.
- [ ] Operational runbooks.
- [ ] Backup/restore playbook.
- [ ] Cloud integration cookbook.
- [ ] API reference docs beyond autogenerated schema.
- [ ] Product UX standards guide.
- [ ] Contribution guidelines and code of conduct.

## 17) Repository consistency gaps

- [ ] Workspace listing references one documentation file that does not currently exist in repo.
- [ ] Source-of-truth product docs should be consolidated and cross-linked.
- [ ] Feature completeness matrix should be maintained in-repo to track parity over time.

## 18) Explicit roadmap targets still not fully satisfied

From the roadmap intent, these remain incomplete or partial:

- [ ] Stable terminal experience in UI (partial today via agent tooling and services panel).
- [ ] Strong session persistence for full conversations.
- [ ] Import/export of everything.
- [ ] Theme customization.
- [ ] Mobile-polished experience.
- [ ] Browser integration.
- [ ] Better sharing/collaboration.
- [ ] Better import from other tools.
- [ ] Safer multi-user support.
- [ ] Public changelog and transparent roadmap workflow.

## 19) Priority summary (recommended next execution order)

P0 (safety + correctness):
- [ ] AuthN/AuthZ, rate limiting, strict CORS posture, command safety UX, store atomicity, tests, CI.

P1 (product core parity):
- [ ] Interactive terminal UI, robust session persistence, import/export, mobile responsiveness, browser/integration surface.

P2 (platform polish and superiority):
- [ ] Federation peers, SDKs, community ecosystem workflows, advanced routing/observability.
