import React from 'react';
import { render } from '@testing-library/react';

import SignupPage from './SignupPage';

describe(' ModulesSignup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SignupPage />);
    expect(baseElement).toBeTruthy();
  });
});
