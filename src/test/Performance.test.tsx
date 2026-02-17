import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Index from '../pages/Index';
import React from 'react';

// Mocks
const FileUploadMock = vi.fn((_props) => <div data-testid="file-upload">FileUpload</div>);
const TailorSectionMock = vi.fn((_props) => <div data-testid="tailor-section">TailorSection</div>);
const GenerateButtonMock = vi.fn((_props) => <div data-testid="generate-button">GenerateButton</div>);

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

vi.mock('@/components/cv-optimiser/GenerateButton', async () => {
  const actualReact = await import('react');
  const MockComp = (props: Record<string, unknown>) => {
    GenerateButtonMock(props);
    return <div data-testid="generate-button">GenerateButton</div>;
  };
  MockComp.displayName = 'GenerateButtonMock';
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

  it('should not re-render heavy components when typing in JobSpecInput', () => {
    render(<Index />);
    const textarea = screen.getByPlaceholderText(/Paste the job specification here/i);
    const initialFileUploadCalls = FileUploadMock.mock.calls.length;
    const initialTailorSectionCalls = TailorSectionMock.mock.calls.length;

    fireEvent.change(textarea, { target: { value: 'New Job Spec' } });

    const finalFileUploadCalls = FileUploadMock.mock.calls.length;
    const finalTailorSectionCalls = TailorSectionMock.mock.calls.length;

    expect(finalFileUploadCalls).toBe(initialFileUploadCalls);
    expect(finalTailorSectionCalls).toBe(initialTailorSectionCalls);
  });

  it('should not re-render GenerateButton when typing in JobSpecInput if requirements status does not change', async () => {
    render(<Index />);
    const textarea = screen.getByPlaceholderText(/Paste the job specification here/i);

    // Initial render count
    // Wait for debounce effects if any (though initial render shouldn't have debounce issues)
    const initialGenerateButtonCalls = GenerateButtonMock.mock.calls.length;

    // Type "a". This changes 'Job Specification' requirement status from missing to present.
    // This MUST cause a re-render.
    fireEvent.change(textarea, { target: { value: 'a' } });

    // Wait for re-render
    await waitFor(() => {
       expect(GenerateButtonMock.mock.calls.length).toBeGreaterThan(initialGenerateButtonCalls);
    });

    const callsAfterFirstChange = GenerateButtonMock.mock.calls.length;

    // Now type "ab". 'Job Specification' is still present.
    // Other requirements (API Key, CV) are still missing.
    // The list of missing requirements SHOULD be identical: ["Gemini API Key", "CV Upload"]
    // So GenerateButton SHOULD NOT re-render.
    fireEvent.change(textarea, { target: { value: 'ab' } });

    // Wait a tick to allow for potential renders
    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalGenerateButtonCalls = GenerateButtonMock.mock.calls.length;

    // If optimization is missing, this will fail because useMemo returns a new array reference
    expect(finalGenerateButtonCalls).toBe(callsAfterFirstChange);
  });
});
