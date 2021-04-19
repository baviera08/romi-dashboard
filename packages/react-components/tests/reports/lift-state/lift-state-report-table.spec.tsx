import { screen, render, RenderResult, cleanup } from '@testing-library/react';
import React from 'react';
import moment from 'moment';
import { LiftStateReportTable } from '../../../lib';
import { getLiftLogs } from '../utils';

const timestamp = new Date('Mon Jan  1 00:00:02 UTC 2001').toISOString();

describe('Lift table test', () => {
  let root: RenderResult;
  beforeEach(() => {
    root = render(<LiftStateReportTable rows={getLiftLogs()} />);
  });

  afterEach(cleanup);

  it('formats dates correctly', async () => {
    const tableFirstDateElement = (await root.getAllByTestId('lift-table-date'))[0];
    expect(tableFirstDateElement.innerHTML).toBe(moment(timestamp).format('lll'));
  });

  it('shows the correct number of rows', () => {
    const allRows = root.container.querySelectorAll('tr').length;
    // -3. from the tr of the table header, filter and pagination table
    expect(allRows - 3).toBe(100);
  });

  it('shows titles correctly', () => {
    expect(screen.queryByText('State')).toBeTruthy();
    expect(screen.queryByText('Door State')).toBeTruthy();
    expect(screen.queryByText('Destination Floor')).toBeTruthy();
    expect(screen.queryByText('Motion State')).toBeTruthy();
    expect(screen.queryByText('Current Floor')).toBeTruthy();
    expect(screen.queryByText('Session ID')).toBeTruthy();
    expect(screen.queryByText('Timestamp')).toBeTruthy();
  });
});
