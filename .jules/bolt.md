## 2025-02-12 - [Testing Mocks vs Real Components]
**Learning:** The existing `Performance.test.tsx` was testing mocks of heavy components (wrapped in `React.memo`), which confirmed that `Index` was passing stable props, but did NOT confirm that the *real* components were memoized. This gave a false sense of security.
**Action:** To verify `React.memo` effectiveness, test against real components by inspecting render counts (e.g., using `console.log` spies or `React.Profiler`) rather than mocking the component under test.

## 2025-02-14 - [Stable Event Handlers in Forms]
**Learning:** Frequent re-renders in large forms (like Job Spec input) can be caused by event handlers that close over changing state (e.g. `handleGenerate`), causing child components (like `GenerateButton`) to re-render unnecessarily on every keystroke, even if they are memoized.
**Action:** Use the `useRef` + `useCallback` pattern to create a stable event handler identity that accesses the latest state via `.current`, preventing prop changes and unnecessary re-renders of child components.
