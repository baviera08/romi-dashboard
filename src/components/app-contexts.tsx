import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import ResourceManager from '../resource-manager';
import { defaultSettings, Settings } from '../settings';
import { NotificationBarContext, NotificationBarProps } from './notification-bar';

/* Declares the ResourcesContext which contains the resources used on the app*/
export const ResourcesContext = React.createContext<ResourceManager>({} as ResourceManager);
// export const ResourcesContext = React.createContext<ResourceConfigurationsType>({});

export const SettingsContext = React.createContext(defaultSettings());

export const DispenserStateContext = React.createContext<
  Readonly<Record<string, RomiCore.DispenserState>>
>({});

export interface AppContextProviderProps extends React.PropsWithChildren<{}> {
  settings: Settings;
  notificationDispatch: React.Dispatch<React.SetStateAction<NotificationBarProps | null>>;
}

export function AppContextProvider(props: AppContextProviderProps): React.ReactElement {
  const { settings, notificationDispatch, children } = props;
  return (
    <SettingsContext.Provider value={settings}>
      <NotificationBarContext.Provider value={notificationDispatch}>
        {children}
      </NotificationBarContext.Provider>
    </SettingsContext.Provider>
  );
}
