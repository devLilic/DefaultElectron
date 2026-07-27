# Delivery Workflow

1. Inspect the working tree, relevant contracts, tests, and documentation.
2. Classify the task: documentation, feature, security/IPC, data/native dependency, quality, or release.
3. Select the minimum specialists from `roles.md` and write a bounded task contract for non-trivial work.
4. Implement one coherent behavior at a time; preserve main/preload/renderer separation.
5. Run the checks required by `quality-gates.md`.
6. Obtain independent review for high-risk work.
7. Report changed behavior, validation evidence, and known limits. Create a local commit only when authorized; never push.

Stop and request direction when requirements conflict, a destructive action is needed, secrets or external publication are required, or a migration cannot be safely rolled back.
