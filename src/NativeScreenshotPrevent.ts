import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  enabled(value: boolean): void;
  enableSecureView(imagePath?: string): void;
  disableSecureView(): void;
  addListener(fn: Function): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ScreenshotPrevent');
