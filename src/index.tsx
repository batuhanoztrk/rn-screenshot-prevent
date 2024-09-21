import {
  type EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import { useEffect } from 'react';

const LINKING_ERROR =
  `The package 'rn-screenshot-prevent' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ScreenshotPreventModule = isTurboModuleEnabled
  ? require('./NativeScreenshotPrevent').default
  : NativeModules.ScreenshotPrevent;

const ScreenshotPrevent = ScreenshotPreventModule
  ? ScreenshotPreventModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

interface IScreenshotPrevent {
  enabled(enabled: boolean): void;
  enableSecureView(imagePath?: string): void;
  disableSecureView(): void;
  addListener(fn: () => void): EmitterSubscription;
}

class RNScreenshotPrevent implements IScreenshotPrevent {
  private eventEmitter =
    Platform.OS === 'ios' ? new NativeEventEmitter(ScreenshotPrevent) : null;

  enabled(enabled: boolean): void {
    ScreenshotPrevent.enabled(enabled);
  }

  enableSecureView(imagePath: string = ''): void {
    ScreenshotPrevent.enableSecureView(imagePath);
  }

  disableSecureView(): void {
    ScreenshotPrevent.disableSecureView();
  }

  addListener(fn: () => void): EmitterSubscription {
    if (Platform.OS === 'ios') {
      if (typeof fn !== 'function') {
        throw new Error(
          'RNScreenshotPrevent: addListener requires valid callback function'
        );
      }

      return this.eventEmitter!.addListener('userDidTakeScreenshot', fn);
    } else {
      throw new Error('RNScreenshotPrevent: addListener not work in android');
    }
  }
}

const rnScreenshotPrevent = new RNScreenshotPrevent();

export const usePreventScreenshot = () => {
  useEffect(() => {
    rnScreenshotPrevent.enabled(true);
    return () => {
      rnScreenshotPrevent.enabled(false);
    };
  }, []);
};

export const useSecureView = (imagePath: string = '') => {
  useEffect(() => {
    rnScreenshotPrevent.enableSecureView(imagePath);
    return () => {
      rnScreenshotPrevent.disableSecureView();
    };
  }, [imagePath]);
};

export default rnScreenshotPrevent;
