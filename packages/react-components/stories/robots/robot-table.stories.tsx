import { Meta, Story } from '@storybook/react';
import React from 'react';
import { RobotTable, RobotTableProps, PaginationOptions } from '../../lib';
import { makeRandomRobot } from '../../tests/robots/test-utils';
import { makeDefinedTask } from '../../tests/test-data/tasks';

const robots = [
  makeRandomRobot('test_robot1', 'test_fleet', 2),
  makeRandomRobot('test_robot2', 'test_fleet', 1),
  makeRandomRobot('test_robot3', 'test_fleet', 3),
  makeRandomRobot('test_robot4', 'test_fleet', 4),
];

const tasks = [
  makeDefinedTask('Delivery', 'test_robot1', 'active_task_1', 3, 3),
  makeDefinedTask('Loop', 'test_robot2', 'active_task_2', 4, 3),
  makeDefinedTask('Clean', 'test_robot3', 'active_task_3', 4, 3),
  makeDefinedTask('Loop', 'test_robot4', 'active_task_4', 4, 3),
];

export default {
  title: 'Robots/Table',
  component: RobotTable,
  argTypes: {
    paginationOptions: {
      control: {
        disable: true,
      },
    },
  },
} as Meta;

export const Table: Story<RobotTableProps> = (args) => {
  const [page, setPage] = React.useState(0);
  const paginationOptions: PaginationOptions = {
    count: args.robots.length,
    rowsPerPage: 10,
    rowsPerPageOptions: [10],
    page,
    onChangePage: (_ev, newPage) => setPage(newPage),
  };

  return (
    <>
      <RobotTable
        {...args}
        style={{ height: '95vh', display: 'flex', flexDirection: 'column' }}
        robots={args.robots.slice(page * 10, (page + 1) * 10)}
        paginationOptions={paginationOptions}
      />
    </>
  );
};

Table.args = {
  robots,
  tasks,
};