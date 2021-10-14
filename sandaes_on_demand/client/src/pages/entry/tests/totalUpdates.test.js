import { render, screen } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';

import Options from '../Options';
import OrderEntry from '../OrderEntry';

test('update scoop subtotal when scoops change', async () => {
  render(<Options optionType='scoops' />);
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');
  const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');
  const chocolateInput = await screen.findByRole('spinbutton', { name: 'Chocolate' });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, '2');
  expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('update topping subtotal when toppings change', async () => {
  render(<Options optionType='toppings' />);
  const toppingsSubtotal = screen.getByText('Toppings total: $', { exact: false });
  expect(toppingsSubtotal).toHaveTextContent('0.00');
  const hotFudgeCheckbox = await screen.findByRole('checkbox', { name: 'Hot fudge' });
  userEvent.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');
  // no need to await and `find` 'cause it's one network request and hotFudgeCheckbox is already in the DOM
  const peanutButterCupsCheckbox = screen.getByRole('checkbox', {
    name: 'Peanut butter cups'
  });
  userEvent.click(peanutButterCupsCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('3.00');
  userEvent.click(peanutButterCupsCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');
});

describe('grand total', () => {
  test('grand total updates properly if scoop is added first', async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole('heading', { name: /grand total: \$/i });
    expect(grandTotal).toHaveTextContent('0.00');
    const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '2');
    expect(grandTotal).toHaveTextContent('4.00');
    const hotFudgeCheckbox = await screen.findByRole('checkbox', { name: 'Hot fudge' });
    userEvent.click(hotFudgeCheckbox);
    expect(grandTotal).toHaveTextContent('5.50');
  });

  test('grand total updates properly if topping is added first', async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole('heading', { name: /grand total: \$/i });
    const hotFudgeCheckbox = await screen.findByRole('checkbox', { name: 'Hot fudge' });
    userEvent.click(hotFudgeCheckbox);
    expect(grandTotal).toHaveTextContent('1.50');
    const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '2');
    expect(grandTotal).toHaveTextContent('5.50');
  });

  test('grand total updates properly if item is removed', async () => {
    render(<OrderEntry />);
    const hotFudgeCheckbox = await screen.findByRole('checkbox', { name: 'Hot fudge' });
    userEvent.click(hotFudgeCheckbox); // 1.50
    const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '2'); // 5.50
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '1'); // 3.50
    const grandTotal = screen.getByRole('heading', { name: /grand total: \$/i });
    expect(grandTotal).toHaveTextContent('3.50');
    userEvent.click(hotFudgeCheckbox); // 2.00
    expect(grandTotal).toHaveTextContent('2.00');
  });
});
