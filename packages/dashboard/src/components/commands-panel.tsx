import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, Info as InfoIcon } from '@material-ui/icons';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Debug from 'debug';
import React from 'react';
import {
  DeliveryRequestForm,
  DoDeliveryRequest,
  DoLoopRequest,
  LoopRequestForm,
} from 'react-components';
import { v4 as uuidv4 } from 'uuid';
import { ResourcesContext } from './app-contexts';

const debug = Debug('OmniPanel:CommandsPanel');

/**
  * task_id: Is intended to be a pseudo-random string generated by the caller which can be used to
  * identify this task as it moves between the queues to completion (or failure).

  * robot_type: Can be used to specify a particular robot fleet for this request.
  * num_loops: The number of times the robot should loop between the specified points.
  * start_name: The name of the waypoint where the robot should begin its loop. If the robot is
  * not already at this point, it will begin the task by moving there.
  * finish_name: The name of the waypoint where the robot should end its looping. The robot will
  * visit this waypoint num_loops times and then stop here on the last visit.
  */
export function requestLoop(
  loopRequestPub: RomiCore.Publisher<RomiCore.Loop> | null,
  fleetName: string,
  numLoops: number,
  startLocationPoint: string,
  endLocationPoint: string,
) {
  loopRequestPub?.publish({
    finish_name: endLocationPoint,
    num_loops: numLoops,
    robot_type: fleetName,
    start_name: startLocationPoint,
    task_id: uuidv4(),
  });
}

/**
* The Delivery task is one where a robot is assigned to pick up an item at one location (pickup_place_name) and deliver it to another (dropoff_place_name). At each of these locations, there is an automation system called workcell/dispenser that loads and unload the item off the robot.

 Currently only these fields are being used in Delivery msg.
* task_id: Unique id for the request.
* pickup_place_name: This is the named waypoint where the robot picks up the item. A "pickup_dispenser" workcell is located at this waypoint.
* pickup_dispenser: Name of the workcell loading the item on the robot at pickup_place_name.
* dropoff_place_name: Named waypoint where the robot drops off the item. A "dropoff_dispenser" workcell is located here.
* dropoff_dispenser: Name of the workcell unloading item from the robot at dropoff_place_name.
*/

export function requestDelivery(
  deliveryRequestPub: RomiCore.Publisher<RomiCore.Delivery> | null,
  pickupPlaceName: string,
  pickupDispenser: string,
  dropOffPlaceName: string,
  dropOffDispenser: string,
  pickupBehaviour?: RomiCore.Behavior,
  dropOffBehavior?: RomiCore.Behavior,
) {
  deliveryRequestPub?.publish({
    items: [{ type_guid: '1', quantity: 1, compartment_name: '1' }],
    pickup_behavior: {
      name: 'pickup_behavior',
      parameters: [{ name: 'pickup_behavior', value: '1' }],
    },
    dropoff_behavior: {
      name: 'dropoff_behavior',
      parameters: [{ name: 'dropoff_behavior', value: '1' }],
    },
    pickup_place_name: pickupPlaceName,
    dropoff_place_name: dropOffPlaceName,
    pickup_dispenser: pickupDispenser,
    dropoff_ingestor: dropOffDispenser,
    task_id: uuidv4(),
  });
}

export interface CommandsPanelProps {
  allFleets: string[];
  transport?: Readonly<RomiCore.Transport>;
}

export const CommandsPanel = React.memo((props: CommandsPanelProps) => {
  debug('render');

  const { allFleets, transport } = props;
  const classes = useStyles();
  const loopRequestPub = React.useMemo(
    () => (transport ? transport.createPublisher(RomiCore.loopRequests) : null),
    [transport],
  );
  const deliveryRequestPub = React.useMemo(
    () => (transport ? transport.createPublisher(RomiCore.deliveryRequest) : null),
    [transport],
  );

  const resourcesContext = React.useContext(ResourcesContext);

  const handleLoopRequest: DoLoopRequest = (
    fleetName: string,
    numLoops: number,
    startLocationPoint: string,
    endLocationPoint: string,
  ) => {
    requestLoop(loopRequestPub, fleetName, numLoops, startLocationPoint, endLocationPoint);
  };

  const handleDeliveryRequest: DoDeliveryRequest = (
    pickupPlaceName: string,
    pickupDispenser: string,
    dropOffPlaceName: string,
    dropOffDispenser: string,
    pickupBehaviour?: RomiCore.Behavior,
    dropOffBehavior?: RomiCore.Behavior,
  ) => {
    requestDelivery(
      deliveryRequestPub,
      pickupPlaceName,
      pickupDispenser,
      dropOffPlaceName,
      dropOffDispenser,
      pickupBehaviour,
      dropOffBehavior,
    );
  };

  const availablePlaces = (fleet: string): string[] => {
    const places = resourcesContext?.robots.getAvailablePlacesPerFleet(fleet);
    return places ? places : [];
  };
  const availableDispensers = (fleet: string, place: string): string[] => {
    const dispensers = resourcesContext?.robots.getDispensersPerFleet(fleet, place);
    return dispensers ? dispensers : [];
  };

  // If we don't have a configuration file with robots and places we should not render the commands forms because we will not be able to execute those commands.
  return (
    <React.Fragment>
      {!!resourcesContext?.robots ? (
        <>
          <Accordion data-component="LoopRequestForm">
            <AccordionSummary
              classes={{ content: classes.accordionSummaryContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h5">Loop Request</Typography>
              <Tooltip
                title="Submit a request for a target fleet to travel the same path as many times as directed"
                arrow
                id="looprequest-tooltip"
              >
                <InfoIcon />
              </Tooltip>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetail}>
              <LoopRequestForm
                doLoopRequest={handleLoopRequest}
                fleetNames={allFleets}
                availablePlaces={availablePlaces}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion data-component="DeliveryRequestForm">
            <AccordionSummary
              classes={{ content: classes.accordionSummaryContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h5">Delivery Request</Typography>
              <Tooltip
                title="Submit a request for a target fleet to perform a delivery between dispensers"
                arrow
                id="deliveryrequest-tooltip"
              >
                <InfoIcon />
              </Tooltip>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetail}>
              <DeliveryRequestForm
                doDeliveryRequest={handleDeliveryRequest}
                fleetNames={allFleets}
                availablePlaces={availablePlaces}
                availableDispensers={availableDispensers}
              />
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <Typography id={'no-config-file-error-msg'} className={classes.errorText}>
          There was an error while loading the commands panel (unable to load resources metadata).
        </Typography>
      )}
    </React.Fragment>
  );
});

export default CommandsPanel;

export const useStyles = makeStyles((theme) => ({
  accordionSummaryContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionDetail: {
    flexFlow: 'column',
    paddingLeft: '0.1rem',
  },
  errorText: {
    padding: '1rem',
    color: theme.palette.error.main,
  },
}));
