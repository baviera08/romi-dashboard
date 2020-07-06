import { robotFormStyle } from './robot-item-loop-form';
import { TextField, Button } from '@material-ui/core';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import Autocomplete from '@material-ui/lab/Autocomplete';
import fakeDispensers from '../mock/data/dispensers';
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';

interface robotDeliveryFormProps {
  fleetName: string;
  robotName?: string;
  requestDelivery(
    pickupPlaceName: string,
    pickupDispenser: string,
    dropOffPlaceName: string,
    dropOffDispenser: string,
    pickupBehaviour?: RomiCore.Behavior,
    dropOffBehavior?: RomiCore.Behavior,
  ): void;
  listOfPlaces: string[];
}

export const RobotDeliveryForm = (props: robotDeliveryFormProps): JSX.Element => {
  const { requestDelivery, listOfPlaces, robotName } = props;
  const classes = robotFormStyle();
  // Places
  const [pickupPlaceName, setPickupPlaceName] = useState(
    listOfPlaces.length >= 2 ? listOfPlaces[0] : '',
  );
  const [dropOffPlaceName, setDropOffPlaceName] = useState(
    listOfPlaces.length >= 2 ? listOfPlaces[1] : '',
  );

  // Dispensers
  const [pickupDispenser, setPickupDispenser] = useState('');
  const [dropOffDispenser, setDropOffDispenser] = useState('');

  // Error states
  const [pickupPlaceNameError, setPickupPlaceNameError] = useState('');
  const [pickupDispenserError, setPickupDispenserError] = useState('');
  const [dropOffPlaceNameError, setDropOffPlaceNameError] = useState('');
  const [dropOffDispenserError, setDropOffDispenserError] = useState('');

  const cleanUpForm = (): void => {
    setPickupPlaceName(listOfPlaces.length >= 2 ? listOfPlaces[0] : '');
    setDropOffPlaceName(listOfPlaces.length >= 2 ? listOfPlaces[1] : '');
    setPickupDispenser('');
    setDropOffDispenser('');
    cleanUpError();
  };

  const cleanUpError = (): void => {
    setPickupPlaceNameError('');
    setDropOffPlaceNameError('');
    setPickupDispenserError('');
    setDropOffDispenserError('');
  };

  const handleDeliveryRequest = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isFormValid()) {
      requestDelivery(pickupPlaceName, pickupDispenser, dropOffPlaceName, dropOffDispenser);
      cleanUpForm();
    }
  };

  const dispensersFromPickUpPlace = React.useMemo(() => {
    const dispenser = !!pickupPlaceName ? fakeDispensers()[pickupPlaceName] : [];
    return !!dispenser ? dispenser : [];
  }, [pickupPlaceName]);

  const dispensersFromDropOffPlace = React.useMemo(() => {
    const dispenser = !!dropOffPlaceName ? fakeDispensers()[dropOffPlaceName] : [];
    return !!dispenser ? dispenser : [];
  }, [dropOffPlaceName]);

  useEffect(() => {
    setPickupDispenserError('');
    !!dispensersFromPickUpPlace &&
      dispensersFromPickUpPlace.length === 0 &&
      setPickupDispenserError('There is no dispensers on this place. Pick another place');
  }, [dispensersFromPickUpPlace]);

  useEffect(() => {
    setDropOffDispenserError('');
    !!dispensersFromDropOffPlace &&
      dispensersFromDropOffPlace.length === 0 &&
      setDropOffDispenserError('There is no dispensers on this place. Pick another place');
  }, [dispensersFromDropOffPlace]);

  const isFormValid = (): boolean => {
    let isValid = true;
    cleanUpError();

    if (pickupPlaceName === dropOffPlaceName) {
      setPickupPlaceNameError('Start Location cannot be equal to finish Location');
      setDropOffPlaceNameError('Start Location cannot be equal to finish Location');
      isValid = false;
    }

    if (pickupPlaceName === dropOffPlaceName) {
      setPickupDispenserError('Pickup dispenser cannot be equal to Drop off dispenser');
      setDropOffDispenserError('Drop off dispenser cannot be equal to Pickup dispenser');
      isValid = false;
    }

    const setEmpty = (fieldSetter: Dispatch<SetStateAction<string>>): void => {
      fieldSetter('Cannot be empty');
      isValid = false;
    };

    !pickupPlaceName && setEmpty(setPickupPlaceNameError);
    !dropOffPlaceName && setEmpty(setDropOffPlaceNameError);
    !pickupDispenser && setEmpty(setPickupDispenserError);
    !dropOffDispenser && setEmpty(setDropOffDispenserError);

    return isValid;
  };

  return (
    <form className={classes.form} onSubmit={handleDeliveryRequest}>
      <div className={classes.divForm}>
        <Autocomplete
          getOptionLabel={option => option}
          onChange={(e, value) => setPickupPlaceName(value || '')}
          options={listOfPlaces}
          id={`${robotName}PickupPlace`}
          renderInput={params => (
            <TextField
              {...params}
              error={!!pickupPlaceNameError}
              helperText={pickupPlaceNameError}
              label="Pick Start Location"
              name="pickupPlace"
              variant="outlined"
            />
          )}
          value={!!pickupPlaceName ? pickupPlaceName : null}
        />
      </div>

      <div className={classes.divForm}>
        <Autocomplete
          getOptionLabel={option => option}
          onChange={(e, value) => setPickupDispenser(value || '')}
          options={dispensersFromPickUpPlace}
          id={`${robotName}PickupDispenser`}
          renderInput={params => (
            <TextField
              {...params}
              error={!!pickupDispenserError}
              helperText={pickupDispenserError}
              label="Pickup Dispenser"
              name="pickupDispenser"
              variant="outlined"
            />
          )}
          value={!!pickupDispenser ? pickupDispenser : null}
        />
      </div>

      <div className={classes.divForm}>
        <Autocomplete
          getOptionLabel={option => option}
          onChange={(e, value) => setDropOffPlaceName(value || '')}
          options={listOfPlaces}
          id={`${robotName}DropoffPlace`}
          renderInput={params => (
            <TextField
              {...params}
              error={!!dropOffPlaceNameError}
              helperText={dropOffPlaceNameError}
              label="Pick Drop Off Location"
              name="dropoffPlace"
              variant="outlined"
            />
          )}
          value={!!dropOffPlaceName ? dropOffPlaceName : null}
        />
      </div>

      <div className={classes.divForm}>
        <Autocomplete
          getOptionLabel={option => option}
          onChange={(e, value) => setDropOffDispenser(value || '')}
          options={dispensersFromDropOffPlace}
          id={`${robotName}DropoffDispenser`}
          renderInput={params => (
            <TextField
              {...params}
              error={!!dropOffDispenserError}
              helperText={dropOffDispenserError}
              label="Pick Drop Off Dispenser"
              name="dropoffDispenser"
              variant="outlined"
            />
          )}
          value={!!dropOffDispenser ? dropOffDispenser : null}
        />
      </div>

      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          {'Request'}
        </Button>
      </div>
    </form>
  );
};