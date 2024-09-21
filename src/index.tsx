import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { useEffect } from 'react';

const LINKING_ERROR =
  `The package 'react-native-screenshot-prevent' doesn't seem to be linked. Make sure: \n\n` +
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

type FN = (resp: any) => void;
type Return = {
  readonly remove: () => void;
};

let addListen: any, RNScreenshotPrevent: any;

if (Platform.OS !== 'web') {
  RNScreenshotPrevent = {
    ...ScreenshotPrevent,
    enableSecureView: function enableSecureView(imagePath: string = '') {
      ScreenshotPrevent.enableSecureView(imagePath);
    },
  };
  const eventEmitter = new NativeEventEmitter(RNScreenshotPrevent);

  /**
   * subscribes to userDidTakeScreenshot event
   * @returns {function} unsubscribe fn
   * @param fn
   */
  addListen = (fn: FN): Return => {
    if (typeof fn !== 'function') {
      console.error(
        'RNScreenshotPrevent: addListener requires valid callback function'
      );
      return {
        remove: (): void => {
          console.error(
            'RNScreenshotPrevent: remove not work because addListener requires valid callback function'
          );
        },
      };
    }

    return eventEmitter.addListener('userDidTakeScreenshot', fn);
  };
} else {
  RNScreenshotPrevent = {
    enabled: (enabled: boolean): void => {
      console.warn(
        'RNScreenshotPrevent: enabled not work in web. value: ' + enabled
      );
    },
    enableSecureView: (imagePath: string = ''): void => {
      console.warn(
        'RNScreenshotPrevent: enableSecureView not work in web.' +
          (imagePath ? ' send: ' + imagePath : '')
      );
    },
    disableSecureView: (): void => {
      console.warn('RNScreenshotPrevent: disableSecureView not work in web');
    },
  };
  addListen = (fn: FN): Return => {
    if (typeof fn !== 'function') {
      console.error(
        'RNScreenshotPrevent: addListener requires valid callback function'
      );
      return {
        remove: (): void => {
          console.error(
            'RNScreenshotPrevent: remove not work because addListener requires valid callback function'
          );
        },
      };
    }
    console.warn('RNScreenshotPrevent: addListener not work in web');
    return {
      remove: (): void => {
        console.warn('RNScreenshotPrevent: remove addListener not work in web');
      },
    };
  };
}

export const usePreventScreenshot = () => {
  useEffect(() => {
    RNScreenshotPrevent.enabled(true);
    return () => {
      RNScreenshotPrevent.enabled(false);
    };
  }, []);
};

export const useSecureView = (imagePath: string = '') => {
  useEffect(() => {
    RNScreenshotPrevent.enableSecureView(imagePath);
    return () => {
      RNScreenshotPrevent.disableSecureView();
    };
  }, [imagePath]);
};

export const enabled: (enabled: boolean) => void = RNScreenshotPrevent.enabled;
export const enableSecureView: (imagePath?: string) => void =
  RNScreenshotPrevent.enableSecureView;
export const disableSecureView: () => void =
  RNScreenshotPrevent.disableSecureView;
export const addListener: (fn: FN) => void = addListen;
export default RNScreenshotPrevent;
