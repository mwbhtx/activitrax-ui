import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackCategoryChip from './FeedbackCategoryChip';

describe('FeedbackCategoryChip', () => {
    test.each([
        ['Bug Report'],
        ['Feature Request'],
        ['Question'],
        ['Discussion'],
    ])('renders label for category: %s', (category) => {
        render(<FeedbackCategoryChip category={category} />);
        expect(screen.getByText(category)).toBeInTheDocument();
    });

    test('renders with unknown category without crashing', () => {
        render(<FeedbackCategoryChip category="Something Else" />);
        expect(screen.getByText('Something Else')).toBeInTheDocument();
    });
});
