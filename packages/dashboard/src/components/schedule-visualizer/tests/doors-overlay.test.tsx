import { Map as LMap } from 'react-leaflet';
import { mount } from 'enzyme';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import DoorsOverlay from '../doors-overlay';
import L from 'leaflet';
import React from 'react';
import { DoorMarker } from 'react-components';

const doors = [
  {
    name: 'main_door',
    v1_x: 8.2,
    v1_y: -5.5,
    v2_x: 7.85,
    v2_y: -6.2,
    door_type: RomiCore.Door.DOOR_TYPE_DOUBLE_SLIDING,
    motion_range: -1.571,
    motion_direction: 1,
  },
  {
    name: 'exit_door',
    v1_x: 12.2,
    v1_y: -2.7,
    v2_x: 14.1,
    v2_y: -2.7,
    door_type: RomiCore.Door.DOOR_TYPE_SINGLE_SLIDING,
    motion_range: -1.571,
    motion_direction: 1,
  },
];

test('Render doors correctly', () => {
  const testDoors = doors;
  const bounds = new L.LatLngBounds([0, 25.7], [-14, 0]);
  const wrapper = mount(
    <LMap
      bounds={[
        [0, 0],
        [1, 1],
      ]}
    >
      <DoorsOverlay bounds={bounds} doors={testDoors} />
    </LMap>,
  );
  expect(wrapper.find(DoorMarker).length).toBe(2);

  wrapper.unmount();
});
