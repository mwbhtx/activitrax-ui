import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackStatusChip from './FeedbackStatusChip';

describe('FeedbackStatusChip', () => {
    test('renders Open status', () => {
        render(<FeedbackStatusChip status="Open" />);
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    test('renders Closed status', () => {
        render(<FeedbackStatusChip status="Closed" />);
        expect(screen.getByText('Closed')).toBeInTheDocument();
    });

    test('renders unknown status without crashing', () => {
        render(<FeedbackStatusChip status="Pending" />);
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });
});
