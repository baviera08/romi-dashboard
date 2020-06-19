import * as L from 'leaflet';
import React from 'react';
import { Conflict, Trajectory, RawKnot } from '../../robot-trajectory-manager';
import ColorManager from './colors';
import RobotTrajectory, { RobotTrajectoryProps } from './robot-trajectory';
import SVGOverlay, { SVGOverlayProps } from './svg-overlay';

export interface RobotTrajectoriesOverlayProps extends SVGOverlayProps {
  trajs: readonly Trajectory[];
  conflicts: Conflict[];
  colorManager: Readonly<ColorManager>;
  conflictsSegments?: RawKnot[];
  trajectSegments?: RawKnot[];
}

export default function RobotTrajectoriesOverlay(
  props: RobotTrajectoriesOverlayProps,
): React.ReactElement {
  const {
    trajs,
    conflicts,
    colorManager,
    conflictsSegments,
    trajectSegments,
    ...otherProps
  } = props;
  const trajectoryContext = React.useContext(RobotTrajectoryContext);

  const bounds =
    props.bounds instanceof L.LatLngBounds ? props.bounds : new L.LatLngBounds(props.bounds);
  const width = bounds.getEast() - bounds.getWest();
  const height = bounds.getNorth() - bounds.getSouth();
  const viewBox = `0 0 ${width} ${height}`;

  // FIXME: hardcode for now, as the source of the footprint is expected to change.
  const footprint = 0.5;

  return (
    <SVGOverlay {...otherProps}>
      <svg viewBox={viewBox}>
        {trajs.map(traj => (
          <trajectoryContext.Component
            key={traj.id}
            trajectory={traj}
            footprint={footprint}
            conflicts={conflicts}
            conflictsSegments={conflictsSegments}
            trajectSegments={trajectSegments}
            colorManager={colorManager}
          />
        ))}
      </svg>
    </SVGOverlay>
  );
}

export interface RobotTrajectoryContext {
  Component: React.ComponentType<RobotTrajectoryProps>;
}

export interface TrajectoryCoords {
  x: number;
  y: number;
}

export const RobotTrajectoryContext = React.createContext<RobotTrajectoryContext>({
  Component: RobotTrajectory,
});
