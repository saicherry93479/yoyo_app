
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { TypographyPresets } from '@/constants/Typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodyMedium' | 'bodySemiBold' | 'caption' | 'captionMedium' | 'small' | 'button';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const linkColor = useThemeColor({ light: lightColor, dark: darkColor }, 'info');

  return (
    <Text
      style={[
        { color, ...TypographyPresets.body },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? { ...styles.link, color: linkColor } : undefined,
        type === 'h1' ? TypographyPresets.h1 : undefined,
        type === 'h2' ? TypographyPresets.h2 : undefined,
        type === 'h3' ? TypographyPresets.h3 : undefined,
        type === 'h4' ? TypographyPresets.h4 : undefined,
        type === 'h5' ? TypographyPresets.h5 : undefined,
        type === 'h6' ? TypographyPresets.h6 : undefined,
        type === 'body' ? TypographyPresets.body : undefined,
        type === 'bodyMedium' ? TypographyPresets.bodyMedium : undefined,
        type === 'bodySemiBold' ? TypographyPresets.bodySemiBold : undefined,
        type === 'caption' ? TypographyPresets.caption : undefined,
        type === 'captionMedium' ? TypographyPresets.captionMedium : undefined,
        type === 'small' ? TypographyPresets.small : undefined,
        type === 'button' ? TypographyPresets.button : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...TypographyPresets.body,
  },
  defaultSemiBold: {
    ...TypographyPresets.bodySemiBold,
  },
  title: {
    ...TypographyPresets.h1,
  },
  subtitle: {
    ...TypographyPresets.h4,
  },
  link: {
    ...TypographyPresets.link,
  },
});
