import React from 'react';
import { render } from '@testing-library/react';

import { HomePage } from './HomePage';

describe(' ModulesHome', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<HomePage apiUrl="" />);
        expect(baseElement).toBeTruthy();
    });
});
