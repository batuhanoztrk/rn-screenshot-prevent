package com.screenshotprevent

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

abstract class ScreenshotPreventSpec internal constructor(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  abstract fun enabled(enabled: Boolean)
  abstract fun enableSecureView(imagePath: String?)
  abstract fun disableSecureView()
}
