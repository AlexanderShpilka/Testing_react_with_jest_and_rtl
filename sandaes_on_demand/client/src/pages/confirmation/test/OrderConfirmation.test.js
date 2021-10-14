import {
  render,
  screen,
  waitForElementToBeRemoved
} from '../../../test-utils/testing-library-utils';
import { rest } from 'msw';

import OrderConfirmation from '../OrderConfirmation';

import { server } from '../../../mocks/server';

test('loading status eventually disappears', async () => {
  render(<OrderConfirmation setOrderPhase={jest.fn()} />);
  const loading = screen.getByText('Loading...');
  expect(loading).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
});

test('handle server error', async () => {
  server.resetHandlers(
    rest.post('http://localhost:3030/order', (req, res, ctx) => res(ctx.status(500)))
  );
  render(<OrderConfirmation setOrderPhase={jest.fn()} />);
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent('An unexpected error occurred. Please try again later.');
});
