import { render, screen } from '@testing-library/react-native';

import { CoverArt } from '@/src/shared/components/CoverArt';

describe('CoverArt', () => {
  it('renders the placeholder treatment when no cover identifiers are available', () => {
    render(<CoverArt title="Book Nest" />);

    expect(screen.getByTestId('cover-placeholder')).toBeTruthy();
    expect(screen.getByText('BN')).toBeTruthy();
  });
});
