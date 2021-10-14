import { render, screen, waitFor } from '../../../test-utils/testing-library-utils';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';

import OrderEntry from '../OrderEntry';

import { server } from '../../../mocks/server';

test('handles error for scoops and toppings routes', async () => {
  server.resetHandlers(
    rest.get('http://localhost:3030/scoops', (req, res, ctx) => res(ctx.status(500))),
    rest.get('http://localhost:3030/toppings', (req, res, ctx) => res(ctx.status(500)))
  );
  render(<OrderEntry />);
  await waitFor(async () => {
    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(2);
  });
});

test('order sundae button is disabled if no scoops selected', async () => {
  render(<OrderEntry />);

  const orderSundaeButton = screen.getByRole('button', { name: /order sundae/i });
  expect(orderSundaeButton).toBeDisabled();

  const chocolateInput = await screen.findByRole('spinbutton', { name: 'Chocolate' });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '1');
  expect(orderSundaeButton).toBeEnabled();

  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '0');
  expect(orderSundaeButton).toBeDisabled();
});
