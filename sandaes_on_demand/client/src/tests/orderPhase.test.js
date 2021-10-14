import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';

test('order phases for happy path', async () => {
  render(<App />);

  const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');

  const chocolateInput = screen.getByRole('spinbutton', { name: 'Chocolate' });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');

  const hotFudgeCheckbox = await screen.findByRole('checkbox', { name: 'Hot fudge' });
  userEvent.click(hotFudgeCheckbox);

  const orderSummaryButton = screen.getByRole('button', { name: /order sundae/i });
  userEvent.click(orderSummaryButton);

  const summaryHeading = screen.getByRole('heading', { name: 'Order Summary' });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole('heading', { name: 'Scoops: $6.00' });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole('heading', { name: 'Toppings: $1.50' });
  expect(toppingsHeading).toBeInTheDocument();

  expect(screen.getByText('1 Vanilla')).toBeInTheDocument();
  expect(screen.getByText('2 Chocolate')).toBeInTheDocument();
  expect(screen.getByText('Hot fudge')).toBeInTheDocument();

  const tcCheckbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
  userEvent.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole('button', { name: /confirm order/i });
  userEvent.click(confirmOrderButton);

  const thankYouHeading = await screen.findByRole('heading', { name: /thank you/i });
  expect(thankYouHeading).toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  const newOrderButton = screen.getByRole('button', { name: /new order/i });
  userEvent.click(newOrderButton);

  const scoopsTotal = await screen.findByText('Scoops total: $0.00');
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = await screen.findByText('Toppings total: $0.00');
  expect(toppingsTotal).toBeInTheDocument();

  await screen.findByRole('spinbutton', { name: 'Vanilla' });
  await screen.findByRole('checkbox', { name: 'Hot fudge' });
});

test('no toppings section if no toppings selected', async () => {
  render(<App />);

  const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');

  const orderSummaryButton = screen.getByRole('button', { name: /order sundae/i });
  userEvent.click(orderSummaryButton);

  const toppingsHeading = screen.queryByRole('heading', { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
});