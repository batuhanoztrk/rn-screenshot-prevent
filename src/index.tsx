import { NativeModules, Platform } from 'react-native';

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

export function multiply(a: number, b: number): Promise<number> {
  return ScreenshotPrevent.multiply(a, b);
}
