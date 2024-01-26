import { render, screen } from '@test-utils';
import { AppTitle } from './app-title';

describe('Welcome component', () => {
  it('has correct Vite guide link', () => {
    render(<AppTitle />);
    expect(screen.getByText('this guide')).toHaveAttribute(
      'href',
      'https://mantine.dev/guides/vite/'
    );
  });
});
