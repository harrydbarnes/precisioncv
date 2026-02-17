## 2025-02-12 - [Testing Mocks vs Real Components]
**Learning:** The existing `Performance.test.tsx` was testing mocks of heavy components (wrapped in `React.memo`), which confirmed that `Index` was passing stable props, but did NOT confirm that the *real* components were memoized. This gave a false sense of security.
**Action:** To verify `React.memo` effectiveness, test against real components by inspecting render counts (e.g., using `console.log` spies or `React.Profiler`) rather than mocking the component under test.

## 2025-02-14 - [Stable Event Handlers in Forms]
**Learning:** Frequent re-renders in large forms (like Job Spec input) can be caused by event handlers that close over changing state (e.g. `handleGenerate`), causing child components (like `GenerateButton`) to re-render unnecessarily on every keystroke, even if they are memoized.
**Action:** Use the `useRef` + `useCallback` pattern to create a stable event handler identity that accesses the latest state via `.current`, preventing prop changes and unnecessary re-renders of child components.

## 2025-05-20 - [Inline Callbacks Breaking Memoization]
**Learning:** Wrapping child components in `React.memo` is insufficient if the parent passes inline arrow functions (e.g., `onChange={(v) => setState(v)}`) as props. These functions are recreated on every render, causing the child to re-render despite memoization.
**Action:** Always wrap callback props in `useCallback` when passing them to memoized components, or ensure the setter is stable (e.g., passing `setState` directly if the signature matches).

## 2025-05-20 - [Component Extraction for Performance]
**Learning:** Defining heavy sub-components or complex mapping logic (like `StyleSelector`) inside the parent component's render function or file prevents memoization and makes testing re-renders difficult.
**Action:** Extract complex sub-components to separate files or exported memoized components. This allows `React.memo` to work effectively and simplifies unit testing with mocks.
