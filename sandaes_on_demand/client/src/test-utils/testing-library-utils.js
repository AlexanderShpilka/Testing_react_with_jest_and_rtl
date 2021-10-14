import { render } from '@testing-library/react';

import { OrderDetailsProvider } from '../contexts/OrderDetails';

const AllTheProviders = ({ children }) => {
  return <OrderDetailsProvider>{children}</OrderDetailsProvider>;
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
