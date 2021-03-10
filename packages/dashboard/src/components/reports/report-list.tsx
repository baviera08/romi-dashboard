import React from 'react';
import { DoorRowsType, DoorStateReport, LogManagement } from 'react-components';

export enum Reports {
  queryAllLogs = 'queryAllLogs',
  showChargerStateReport = 'showChargerStateReport',
  showDoorStateReport = 'showDoorStateReport',
  showLiftStateReport = 'showLiftStateReport',
  showNegotiationsReport = 'showNegotiationsReport',
  showRobotStateReport = 'showRobotStateReport',
  showRobotMotionPlansReport = 'showRobotMotionPlansReport',
  showRobotActionReport = 'showRobotActionReport',
  showTasksReport = 'showTasksReport',
  showUserActionsReport = 'showUserActionsReport',
  showLoginsReport = 'showLoginsReport',
  showLogoutsReport = 'showLogoutsReport',
  showLoginFailuresReport = 'showLoginFailuresReport',
  showWorkCellStatesReport = 'showWorkCellStatesReport',
}

/**
 * Trash
 */
const getLogLabels = () => [
  { label: 'Web Server', value: 'web-server' },
  { label: 'RMF core', value: 'rmf-core' },
];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const getLogs = () => {
  const rows = [];
  for (let i = 0; i < 500; i++) {
    rows.push({
      message: 'Test' + i,
      level: 'Debug',
      timestamp: randomDate(new Date(2012, 0, 1), new Date()).toISOString(),
    });
  }
  return rows;
};

const getLogsPromise = async () => getLogs();
const getLabelsPromise = async () => getLogLabels();
/**
 * Trash
 */

/**
 * Report dictionary with it associated component
 */

export const ReportContainer: Record<string, React.ReactElement> = {
  [Reports.queryAllLogs]: <LogManagement getLogs={getLogsPromise} getLabels={getLabelsPromise} />,
  [Reports.showChargerStateReport]: <h1>Still not implemented</h1>,
  [Reports.showDoorStateReport]: (
    <DoorStateReport
      rows={
        [
          {
            name: 'doorA',
            status: 'closed',
            message: 'test',
            timestamp: new Date().toISOString(),
          },
        ] as DoorRowsType
      }
      tableSize={'49vh'}
    />
  ),
  [Reports.showLiftStateReport]: <h1>Still not implemented</h1>,
  [Reports.showNegotiationsReport]: <h1>Still not implemented</h1>,
  [Reports.showRobotStateReport]: <h1>Still not implemented</h1>,
  [Reports.showRobotMotionPlansReport]: <h1>Still not implemented</h1>,
  [Reports.showRobotActionReport]: <h1>Still not implemented</h1>,
  [Reports.showTasksReport]: <h1>Still not implemented</h1>,
  [Reports.showUserActionsReport]: <h1>Still not implemented</h1>,
  [Reports.showLoginsReport]: <h1>Still not implemented</h1>,
  [Reports.showLogoutsReport]: <h1>Still not implemented</h1>,
  [Reports.showLoginFailuresReport]: <h1>Still not implemented</h1>,
  [Reports.showWorkCellStatesReport]: <h1>Still not implemented</h1>,
};
