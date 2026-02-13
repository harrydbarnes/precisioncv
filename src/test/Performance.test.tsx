import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Index from '../pages/Index';
import React from 'react';

// Mocks
const FileUploadMock = vi.fn((_props) => <div data-testid="file-upload">FileUpload</div>);
const TailorSectionMock = vi.fn((_props) => <div data-testid="tailor-section">TailorSection</div>);

// We need to return a memoized component from the mock to test if props are stable.
vi.mock('@/components/cv-optimiser/FileUpload', async () => {
  const actualReact = await import('react');
  const MockComp = (props: Record<string, unknown>) => {
    FileUploadMock(props);
    return <div data-testid="file-upload">FileUpload</div>;
  };
  MockComp.displayName = 'FileUploadMock';
  return {
    default: actualReact.memo(MockComp)
  };
});

vi.mock('@/components/cv-optimiser/TailorSection', async () => {
  const actualReact = await import('react');
  const MockComp = (props: Record<string, unknown>) => {
    TailorSectionMock(props);
    return <div data-testid="tailor-section">TailorSection</div>;
  };
  MockComp.displayName = 'TailorSectionMock';
  return {
    default: actualReact.memo(MockComp)
  };
});

// Mock other components to avoid clutter and potential errors
vi.mock('@/components/cv-optimiser/Header', () => ({ default: () => <div>Header</div> }));
vi.mock('@/components/cv-optimiser/ResultsDisplay', () => ({ default: () => <div>ResultsDisplay</div> }));
vi.mock('@/components/Footer', () => ({ default: () => <div>Footer</div> }));

describe('Performance Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('re-renders heavy components when typing in JobSpecInput without optimization', () => {
    render(<Index />);

    // Initial render might trigger multiple renders due to strict mode or hooks

    const initialFileUploadCalls = FileUploadMock.mock.calls.length;
    const initialTailorSectionCalls = TailorSectionMock.mock.calls.length;
    // console.log(`Initial FileUpload calls: ${initialFileUploadCalls}`);

    // Find JobSpecInput textarea and type
    const textarea = screen.getByPlaceholderText(/Paste the job specification here/i);
    fireEvent.change(textarea, { target: { value: 'New Job Spec' } });

    // Check renders again
    const finalFileUploadCalls = FileUploadMock.mock.calls.length;
    const finalTailorSectionCalls = TailorSectionMock.mock.calls.length;

    // console.log(`FileUpload calls: ${initialFileUploadCalls} -> ${finalFileUploadCalls}`);
    // console.log(`TailorSection calls: ${initialTailorSectionCalls} -> ${finalTailorSectionCalls}`);

    // We expect NO re-renders because props (callbacks) are stable and components are memoized.
    // If optimization works, these should be equal.
    expect(finalFileUploadCalls).toBe(initialFileUploadCalls);
    expect(finalTailorSectionCalls).toBe(initialTailorSectionCalls);
  });
});
