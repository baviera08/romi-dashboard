import { Button, ButtonGroup } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import RestoreIcon from '@material-ui/icons/Restore';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import React from 'react';

export interface TreeButtonGroupProps {
  disableReset: boolean;
  disableClear: boolean;
  disableRestore: boolean;
  handlResetClick?: () => void;
  handleClearClick?: () => void;
  handleRestoreClick?: () => void;
}

// className={classes.buttonGroupDiv}
export const TreeButtonGroup = (props: TreeButtonGroupProps) => {
  const {
    disableReset,
    disableClear,
    disableRestore,
    handlResetClick,
    handleClearClick,
    handleRestoreClick,
  } = props;
  return (
    <div>
      <ButtonGroup fullWidth>
        <Button
          id="reset-button"
          disabled={disableReset}
          onClick={() => handlResetClick && handlResetClick()}
        >
          <RestoreIcon />
          Reset
        </Button>
        <Button
          id="clear-button"
          disabled={disableClear}
          onClick={() => handleClearClick && handleClearClick()}
        >
          <ClearAllIcon />
          Clear
        </Button>
        <Button
          id="restore-button"
          disabled={disableRestore}
          onClick={() => handleRestoreClick && handleRestoreClick()}
        >
          <RestoreFromTrashIcon />
          Restore
        </Button>
      </ButtonGroup>
    </div>
  );
};
