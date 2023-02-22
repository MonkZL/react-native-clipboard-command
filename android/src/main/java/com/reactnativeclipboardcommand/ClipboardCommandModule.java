package com.reactnativeclipboardcommand;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = ClipboardCommandModule.NAME)
public class ClipboardCommandModule extends ContextBaseJavaModule {
  public static final String NAME = "ClipboardCommand";

  public ClipboardCommandModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }


  private ClipboardManager getClipboardService() {
    return (ClipboardManager) getContext().getSystemService(getContext().CLIPBOARD_SERVICE);
  }

  private String getPackageName() {
    return getContext().getPackageName();
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void setCommand(String command) {
    try {
      ClipData clipdata = ClipData.newPlainText(getPackageName(), command);
      ClipboardManager clipboard = getClipboardService();
      clipboard.setPrimaryClip(clipdata);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void getCommand(Promise promise) {
    try {
      ClipboardManager clipboard = getClipboardService();
      ClipData clipData = clipboard.getPrimaryClip();
      if (clipData == null) {
        promise.reject("0", "没有数据");
        return;
      }
      CharSequence label = clipData.getDescription().getLabel();
      if (TextUtils.equals(label, getPackageName())) {
        promise.reject("1", "自己在应用内复制的指令");
        return;
      }
      if (clipData.getItemCount() >= 1) {
        ClipData.Item firstItem = clipboard.getPrimaryClip().getItemAt(0);
        promise.resolve("" + firstItem.getText());
      } else {
        promise.reject("0", "没有数据");
      }
    } catch (Exception e) {
      promise.reject("2", e.getMessage());
    }
  }

}
