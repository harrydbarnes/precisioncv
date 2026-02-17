## 2026-02-17 - Accessible Text Diffs
**Learning:** Text comparisons (diffs) that rely solely on color or strikethrough for meaning are inaccessible to screen reader users.
**Action:** Always include visually hidden text (e.g., `<span class="sr-only">Added: </span>`) before or within the modified text segments to explicitly announce the change type.
