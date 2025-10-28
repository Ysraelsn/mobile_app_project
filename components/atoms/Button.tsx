import { Pressable, PressableProps, StyleSheet } from "react-native";

import { Text } from "./Text";

interface ButtonProps extends PressableProps {
  label?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

export const Button = ({
  children,
  label,
  onPress,
  disabled,
  style,
  ...rest
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#C6862E" : "#E3A542",
        },
        styles.button,
        disabled ? styles.disabled : {},
      ]}
      {...rest}
    >
      {label ? <Text style={styles.buttonText}>{label}</Text> : children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  disabled: {
    backgroundColor: "rgba(227, 165, 66, 0.5)",
  },
});

export default Button;
