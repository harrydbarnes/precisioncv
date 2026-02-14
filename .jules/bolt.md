## 2025-02-12 - [Testing Mocks vs Real Components]
**Learning:** The existing `Performance.test.tsx` was testing mocks of heavy components (wrapped in `React.memo`), which confirmed that `Index` was passing stable props, but did NOT confirm that the *real* components were memoized. This gave a false sense of security.
**Action:** To verify `React.memo` effectiveness, test against real components by inspecting render counts (e.g., using `console.log` spies or `React.Profiler`) rather than mocking the component under test.
