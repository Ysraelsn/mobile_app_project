import {
  Text as NativeText,
  TextProps as NativeTextProps,
  StyleProp,
  TextStyle,
} from "react-native";

interface TextProps extends NativeTextProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  style?: StyleProp<TextStyle>;
  color?: string;
}

export const Text = ({
  children,
  align = "left",
  style,
  color,
  ...rest
}: TextProps) => {
  return (
    <NativeText style={[{ textAlign: align, color: color }, style]} {...rest}>
      {children}
    </NativeText>
  );
};

export default Text;
