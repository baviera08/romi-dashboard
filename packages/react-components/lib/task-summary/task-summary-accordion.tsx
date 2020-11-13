import React from 'react';
import Debug from 'debug';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { TreeItem, TreeView } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import SimpleInfo, { SimpleInfoData } from '../simple-info';
import { formatStatus, getActorFromStatus, getStateLabel } from './task-summary-utils';

const debug = Debug('OmniPanel:TaskSummaryAccordion');

interface TaskSummaryAccordionInfoProps {
  task: RomiCore.TaskSummary;
}

export const TaskSummaryAccordionInfo = (props: TaskSummaryAccordionInfoProps) => {
  const { task } = props;
  const statusDetails = formatStatus(task.status);
  const stateLabel = getStateLabel(task.state);
  const data = [
    { name: 'TaskId', value: task.task_id, wrap: false },
    { name: 'State', value: stateLabel },
    { name: 'Status', value: statusDetails },
    { name: 'Submission Time', value: task.submission_time.sec },
    { name: 'Start time', value: task.start_time.sec },
    { name: 'End Time', value: task.end_time.sec },
  ] as SimpleInfoData[];

  return <SimpleInfo data={data} />;
};

export interface TaskSummaryAccordionProps {
  tasks: RomiCore.TaskSummary[];
}

export const TaskSummaryAccordion = React.memo((props: TaskSummaryAccordionProps) => {
  debug('task summary status panel render');

  const { tasks } = props;
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string>('');

  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string) => {
    setSelected(nodeIds);
  };

  // Added a useCallback here because this function is been used inside the useEffect.
  const determineStyle = React.useCallback(
    (state: number): string => {
      switch (state) {
        case RomiCore.TaskSummary.STATE_QUEUED:
          return classes.queued;
        case RomiCore.TaskSummary.STATE_ACTIVE:
          return classes.active;
        case RomiCore.TaskSummary.STATE_COMPLETED:
          return classes.completed;
        case RomiCore.TaskSummary.STATE_FAILED:
          return classes.failed;
        default:
          return 'UNKNOWN';
      }
    },
    [classes],
  );

  const renderActor = (taskStatus: string): React.ReactElement | undefined => {
    const actor = getActorFromStatus(taskStatus);
    if (!actor) return;
    return (
      <Typography variant="body1" id="task-actor" className={classes.taskActor}>
        {actor}
      </Typography>
    );
  };

  const renderTaskTreeItem = (task: RomiCore.TaskSummary) => {
    return (
      <TreeItem
        data-component="TreeItem"
        nodeId={task.task_id}
        key={task.task_id}
        classes={{
          label: `${determineStyle(task.state)} ${classes.labelContent}`,
          root: classes.treeChildren,
          expanded: classes.expanded,
        }}
        label={
          <>
            <Typography variant="body1" noWrap>
              {task.state === RomiCore.TaskSummary.STATE_ACTIVE && (
                // TODO: add onClick with e.preventDefault() and with the pause plans logic.
                <IconButton disabled>
                  <PlayCircleFilledWhiteIcon />
                </IconButton>
              )}
              {task.state === RomiCore.TaskSummary.STATE_QUEUED && (
                <IconButton disabled>
                  <PauseCircleFilledIcon />
                </IconButton>
              )}
              {task.task_id}
            </Typography>
            {renderActor(task.status)}
          </>
        }
      >
        <TaskSummaryAccordionInfo task={task} key={task.task_id} />
      </TreeItem>
    );
  };

  return (
    <TreeView
      className={classes.root}
      onNodeSelect={handleSelect}
      onNodeToggle={handleToggle}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      selected={selected}
    >
      {tasks.reverse().map((task) => renderTaskTreeItem(task))}
    </TreeView>
  );
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: '1rem',
  },
  accordionDetailLine: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0.5),
  },
  treeChildren: {
    margin: '0.5rem 0',
  },
  labelContent: {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 0 25px 0 rgb(72, 94, 116, 0.3)',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  expanded: {
    borderLeft: `0.1rem solid #cccccc`,
  },
  /**
   * The idea is to maintain the same itemTree color depending on the task state even on selected.
   * There are two styles API provided by the material-ui Tree library: `selected` and `label`.
   * On a item select the library creates a class called `selected` that has precedence over the
   * classes we could add using the API. So to override the background color of the `selected`
   * we added `!important` to our custom styles that manage background color of the item tree.
   */
  completed: {
    backgroundColor: '#4E5453 !important',
  },
  queued: {
    backgroundColor: theme.palette.warning.main + '!important',
  },
  active: {
    backgroundColor: theme.palette.success.light + '!important',
  },
  failed: {
    backgroundColor: theme.palette.error.main + '!important',
  },
  taskActor: {
    alignSelf: 'center',
  },
}));

export default TaskSummaryAccordion;