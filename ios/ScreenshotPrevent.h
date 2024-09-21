
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNScreenshotPreventSpec.h"
#import "RCTBridgeModule.h"
#import "RCTConvert.h"

@interface ScreenshotPrevent : NSObject <NativeScreenshotPreventSpec>
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>

@interface ScreenshotPrevent : NSObject <RCTBridgeModule>
#endif

@end
