# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt

# Keep Coil3 classes (image loading library used by Expo modules)
-keep class coil3.** { *; }
-keep interface coil3.** { *; }
-dontwarn coil3.**

# Keep Coil3 network classes
-keep class coil3.network.** { *; }
-keep interface coil3.network.** { *; }
-dontwarn coil3.network.**

# Keep Coil3 OkHttp integration
-keep class coil3.network.okhttp.** { *; }
-keep interface coil3.network.okhttp.** { *; }
-dontwarn coil3.network.okhttp.**

# Keep Kotlin Metadata for Coil3
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

# Keep all classes referenced by Coil3
-keep class kotlin.Metadata { *; }

# Additional rules for React Native and Expo
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class androidx.** { *; }

# Keep all native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep all public classes that have public/protected methods or fields
-keep public class * {
    public protected *;
}

# Preserve line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Remove verbose logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
