import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EmptyState } from '../components/public/EmptyState';
import { SectionSkeleton } from '../components/public/SectionSkeleton';
import { SectionError } from '../components/public/SectionError';

describe('Public UI States (EmptyState, Skeleton, Error)', () => {
  it('renders EmptyState with appropriate message and description', () => {
    const { getByText } = render(
      <EmptyState
        type="projects"
        message="No projects yet"
        description="Projects added via admin will show here."
      />
    );
    expect(getByText('No projects yet')).toBeDefined();
    expect(getByText('Projects added via admin will show here.')).toBeDefined();
  });

  it('renders SectionSkeleton with hero, card, and badges formats', () => {
    const { container: heroContainer } = render(<SectionSkeleton type="hero" />);
    expect(heroContainer.querySelector('.animate-pulse')).toBeDefined();

    const { container: cardContainer } = render(<SectionSkeleton type="card" count={2} />);
    expect(cardContainer.querySelector('.animate-pulse')).toBeDefined();

    const { container: badgesContainer } = render(<SectionSkeleton type="badges" />);
    expect(badgesContainer.querySelector('.animate-pulse')).toBeDefined();
  });

  it('renders SectionError with title and retry button', () => {
    let retried = false;
    const { getByText } = render(
      <SectionError title="Failed to load skills" onRetry={() => { retried = true; }} />
    );
    expect(getByText('Failed to load skills')).toBeDefined();
    const retryBtn = getByText('Retry');
    retryBtn.click();
    expect(retried).toBe(true);
  });
});
