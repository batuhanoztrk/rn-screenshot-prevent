package com.screenshotprevent

import android.app.Activity
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.ImageView
import android.widget.RelativeLayout
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import java.net.URL


class ScreenshotPreventModule internal constructor(context: ReactApplicationContext) :
  ScreenshotPreventSpec(context) {

  private var overlayLayout: RelativeLayout? = null;
  private var secureFlagWasSet: Boolean? = null;

  private var lifecycleEventListener = object : LifecycleEventListener {
    override fun onHostResume() {
      currentActivity?.let {
        if (overlayLayout != null) {
          it.runOnUiThread {
            (it.window.decorView.rootView as ViewGroup).removeView(overlayLayout)
            if (secureFlagWasSet == true) {
              it.window.setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
              )
              secureFlagWasSet = false
            }
          }
        }
      }
    }

    override fun onHostPause() {
      currentActivity?.let {
        if (overlayLayout != null) {
          it.runOnUiThread {
            val layoutParams = RelativeLayout.LayoutParams(
              RelativeLayout.LayoutParams.MATCH_PARENT,
              RelativeLayout.LayoutParams.MATCH_PARENT
            )
            (it.window.decorView.rootView as ViewGroup).addView(overlayLayout, layoutParams)

            val flags = it.window.attributes.flags

            if ((flags and WindowManager.LayoutParams.FLAG_SECURE) != 0) {
              it.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
              secureFlagWasSet = true
            } else {
              secureFlagWasSet = false
            }
          }
        }
      }
    }

    override fun onHostDestroy() {
    }
  }

  init {
    context.addLifecycleEventListener(lifecycleEventListener)
  }

  @ReactMethod
  override fun enabled(enabled: Boolean) {
    currentActivity?.let {
      it.runOnUiThread {
        if (enabled) {
          it.window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
          )
        } else {
          it.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
        }
      }
    }
  }

  @ReactMethod
  override fun enableSecureView(imagePath: String) {
    currentActivity?.let {
      if (overlayLayout == null) {
        createOverlayLayout(it, imagePath)
      }

      it.runOnUiThread {
        it.window.setFlags(
          WindowManager.LayoutParams.FLAG_SECURE,
          WindowManager.LayoutParams.FLAG_SECURE
        )
      }
    }
  }

  @ReactMethod
  override fun disableSecureView() {
    currentActivity?.let {
      it.runOnUiThread {
        if (overlayLayout != null) {
          (it.window.decorView.rootView as ViewGroup).removeView(overlayLayout)

          overlayLayout = null
        }

        it.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
      }
    }
  }

  private fun createOverlayLayout(activity: Activity, imagePath: String) {
    overlayLayout = RelativeLayout(activity).apply {
      setBackgroundColor(Color.parseColor("#FFFFFF"))

      val imageView = ImageView(activity)
      val imageParams = RelativeLayout.LayoutParams(
        RelativeLayout.LayoutParams.MATCH_PARENT,
        RelativeLayout.LayoutParams.WRAP_CONTENT
      )
      imageParams.addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE)
      imageView.layoutParams = imageParams

      val bitmap = decodeImageUri(imagePath)

      if (bitmap != null) {
        val imageHeight =
          (bitmap.height * (activity.resources.displayMetrics.widthPixels.toFloat() / bitmap.width)).toInt()
        val scaledBitmap = Bitmap.createScaledBitmap(
          bitmap,
          activity.resources.displayMetrics.widthPixels,
          imageHeight,
          true
        )
        imageView.setImageBitmap(scaledBitmap)
      }

      addView(imageView)
    }
  }

  private fun decodeImageUri(imagePath: String): Bitmap? {
    try {
      val url = URL(imagePath)
      return BitmapFactory.decodeStream(url.openConnection().getInputStream())
    } catch (e: Exception) {
      e.printStackTrace()
      return null
    }
  }

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "ScreenshotPrevent"
  }
}
