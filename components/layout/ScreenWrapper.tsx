import React from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MobileHeader, { type MenuOption } from './MobileHeader';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  // Header props
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  headerRightComponent?: React.ReactNode;
  hideMenuButton?: boolean;
  menuOptions?: MenuOption[];
  // SafeArea props
  useSafeArea?: boolean;
  backgroundColor?: string;
}

export default function ScreenWrapper({
  children,
  // Header defaults
  showHeader = true,
  headerTitle = 'GYMMETRY',
  headerSubtitle,
  showBackButton = false,
  onPressBack,
  headerRightComponent,
  hideMenuButton = false,
  menuOptions,
  // SafeArea defaults
  useSafeArea = true,
  backgroundColor,
}: ScreenWrapperProps) {
  const theme = useColorScheme();
  const bg = backgroundColor || Colors[theme].background;
  const content = (
    <>
      {Platform.OS !== 'web' && showHeader && (
        <MobileHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          showBackButton={showBackButton}
          onPressBack={onPressBack}
          RightComponent={headerRightComponent}
          hideMenuButton={hideMenuButton}
          menuOptions={menuOptions}
        />
      )}
      {children}
    </>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg, marginBottom: 16 }}>
        {content}
      </SafeAreaView>
    );
  }

  return <View style={{ flex: 1, backgroundColor: bg }}>{content}</View>;
}
