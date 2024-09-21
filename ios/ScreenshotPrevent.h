
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNScreenshotPreventSpec.h"

@interface ScreenshotPrevent : NSObject <NativeScreenshotPreventSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ScreenshotPrevent : NSObject <RCTBridgeModule>
#endif

@end
