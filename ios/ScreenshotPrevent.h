
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNScreenshotPreventSpec.h"
#import "RCTBridgeModule.h"
#import "RCTConvert.h"
#import "RCTEventEmitter.h"

@interface ScreenshotPrevent : RCTEventEmitter <NativeScreenshotPreventSpec>
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import <React/RCTEventEmitter.h>

@interface ScreenshotPrevent : RCTEventEmitter <RCTBridgeModule>
#endif

@end
