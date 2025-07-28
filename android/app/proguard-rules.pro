# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Suppress warnings for react-native-screens
-dontwarn com.swmansion.rnscreens.**
-keep class com.swmansion.rnscreens.** { *; }

# Suppress general deprecation warnings
-dontwarn androidx.**
-dontwarn com.facebook.react.**

# Suppress warnings for async-storage and webview
-dontwarn com.reactnativecommunity.asyncstorage.**
-dontwarn com.reactnativecommunity.webview.**
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-keep class com.reactnativecommunity.webview.** { *; }

# Add any project specific keep options here:
