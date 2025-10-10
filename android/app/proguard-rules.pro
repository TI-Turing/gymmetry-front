# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt

# ===== COIL 3 IMAGE LOADING LIBRARY =====
# CRITICAL: Prevent R8 from removing Coil3 classes
-keep,allowobfuscation class coil3.** { *; }
-keep,allowobfuscation interface coil3.** { *; }
-keep,allowobfuscation enum coil3.** { *; }
-keepclassmembers class coil3.** { *; }
-keepnames class coil3.** { *; }

# Keep Coil3 PlatformContext (specifically needed for OkHttp integration)
-keep,allowobfuscation class coil3.PlatformContext { *; }
-keep,allowobfuscation interface coil3.PlatformContext { *; }
-keepnames class coil3.PlatformContext { *; }

# Keep Coil3 network classes
-keep class coil3.network.** { *; }
-keep interface coil3.network.** { *; }
-keep class coil3.network.ConnectivityChecker { *; }
-keepclassmembers class coil3.network.** { *; }

# Keep Coil3 OkHttp integration (critical for network fetching)
-keep class coil3.network.okhttp.** { *; }
-keep interface coil3.network.okhttp.** { *; }
-keepclassmembers class coil3.network.okhttp.** { *; }
-keep class coil3.network.okhttp.OkHttpNetworkFetcher** { *; }

# Suppress warnings for Coil3
-dontwarn coil3.**
-dontwarn coil3.network.**
-dontwarn coil3.network.okhttp.**

# Keep Kotlin Metadata for Coil3
-keepattributes *Annotation*, InnerClasses, Signature, Exception
-dontnote kotlinx.serialization.AnnotationsKt

# Keep all classes referenced by Coil3
-keep class kotlin.Metadata { *; }
-keep class kotlin.** { *; }
-keep interface kotlin.** { *; }

# Additional rules for React Native and Expo
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class androidx.** { *; }

# Keep OkHttp (used by Coil3 for network operations)
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# Keep all native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep all public classes that have public/protected methods or fields
-keep public class * {
    public protected *;
}

# Keep all classes that are referenced by reflection
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep generic signature (for proper type checking)
-keepattributes Signature

# Remove verbose logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# ===== AGGRESSIVE KEEP RULES FOR MISSING CLASSES =====
# Force R8 to NOT remove classes that are used via reflection
-keepclassmembers,allowobfuscation class * {
    @coil3.annotation.** <methods>;
}

# Prevent stripping of classes referenced by Coil3 network layer
-keep class * implements coil3.network.NetworkFetcher { *; }
-keep class * implements coil3.network.ConnectivityChecker { *; }

# If R8 still complains about missing classes, keep everything
-ignorewarnings
-dontoptimize
-dontobfuscate
-keep,allowobfuscation,allowshrinking class * { *; }
