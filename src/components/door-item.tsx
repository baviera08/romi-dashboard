import {
  Button,
  ButtonGroup,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelProps,
  ExpansionPanelSummary,
  Typography,
  useTheme,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import DoorStateManager from '../door-state-manager';
import { doorItemStyles } from './doors-panel';

export interface DoorItemProps extends Omit<ExpansionPanelProps, 'children'> {
  door: Readonly<RomiCore.Door>;
  doorState?: Readonly<RomiCore.DoorState>;
  enableControls?: boolean;
  onDoorClick?(door: RomiCore.Door): void;
  onOpenClick?(door: RomiCore.Door): void;
  onCloseClick?(door: RomiCore.Door): void;
}

export const DoorItem = React.forwardRef(function(
  props: DoorItemProps,
  ref: React.Ref<HTMLElement>,
): React.ReactElement {
  const { door, doorState, enableControls, onOpenClick, onCloseClick, ...otherProps } = props;
  const classes = doorItemStyles();
  const theme = useTheme();

  function doorModeLabelClasses(doorState?: RomiCore.DoorState): string {
    if (!doorState) {
      return '';
    }
    switch (doorState.current_mode.value) {
      case RomiCore.DoorMode.MODE_OPEN:
        return `${classes.doorLabel} ${classes.doorLabelOpen}`;
      case RomiCore.DoorMode.MODE_CLOSED:
        return `${classes.doorLabel} ${classes.doorLabelClosed}`;
      case RomiCore.DoorMode.MODE_MOVING:
        return `${classes.doorLabel} ${classes.doorLabelMoving}`;
      default:
        return '';
    }
  }

  return (
    <ExpansionPanel ref={ref} {...otherProps}>
      <ExpansionPanelSummary
        classes={{ content: classes.expansionSummaryContent }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h5">{door.name}</Typography>
        <Typography className={doorModeLabelClasses(doorState)} variant="button">
          {DoorStateManager.doorModeToString(doorState)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionDetail}>
        <div className={classes.expansionDetailLine}>
          <Typography variant="body1">Type:</Typography>
          <Typography variant="body1">
            {DoorStateManager.doorTypeToString(door.door_type)}
          </Typography>
        </div>
        <Divider />
        <div className={classes.expansionDetailLine}>
          <Typography variant="body1">Motion Direction:</Typography>
          <Typography variant="body1">
            {DoorStateManager.motionDirectionToString(door.motion_direction)}
          </Typography>
        </div>
        <Divider />
        <div className={classes.expansionDetailLine}>
          <Typography variant="body1">Motion Range:</Typography>
          <Typography variant="body1">{door.motion_range}</Typography>
        </div>
        <Divider />
        <div className={classes.expansionDetailLine}>
          <Typography variant="body1">Location:</Typography>
          <Typography variant="body1">
            ({door.v1_x.toFixed(3)}, {door.v1_y.toFixed(3)})
          </Typography>
        </div>
        <ButtonGroup style={{ marginTop: theme.spacing(1) }} fullWidth disabled={!enableControls}>
          <Button onClick={() => onCloseClick && onCloseClick(door)}>Close</Button>
          <Button onClick={() => onOpenClick && onOpenClick(door)}>Open</Button>
        </ButtonGroup>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
});

export default DoorItem;
