import { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

export interface UseRoomPlanInterface {
  startRoomPlan: (scanName: string, api?: Api) => Promise<void>;
  showInstructions: boolean;
  roomScanStatus: ScanStatus;
}

export interface Api {
  url: string;
  token: string;
}

export enum ScanStatus {
  NotStarted = 'NotStarted',
  PermissionDenied = 'PermissionDenied',
  Canceled = 'Canceled',
  TimedOut = 'TimedOut',
  Error = 'Error',
  OK = 'OK',
}

export default function useRoomPlan(): UseRoomPlanInterface {
  const { RoomPlanCaptureModule, EventEmitter } = NativeModules;
  const onDismissEvent = new NativeEventEmitter(EventEmitter);
  const [roomScanStatus, setRoomScanStatus] = useState<ScanStatus>(
    ScanStatus.NotStarted
  );
  const showInstructions =
    roomScanStatus === ScanStatus.Canceled ||
    roomScanStatus === ScanStatus.NotStarted;

  useEffect(() => {
    // Set up the listener for when the SwiftUI controller is dismissed
    const subscription = onDismissEvent.addListener(
      'onDismissEvent',
      (event) => {
        setRoomScanStatus(event.value);
      }
    );

    return () => {
      subscription?.remove();
    };
  });

  async function startRoomPlan(scanName: string, api?: Api) {
    try {
      if (api) {
        RoomPlanCaptureModule.startCapture(scanName, api.token, api.url);
      } else {
        RoomPlanCaptureModule.startCapture(scanName);
      }
    } catch (error) {
      console.error('Room scan failed: ', error);
      throw new Error('Unable to start room scan.');
    }
  }

  const interf: UseRoomPlanInterface = {
    startRoomPlan,
    roomScanStatus,
    showInstructions,
  };

  return interf;
}
