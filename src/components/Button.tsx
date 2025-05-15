import {
  Button as GluestackButton,
  Text,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof GluestackButton> & {
  title: string;
  variant?: "solid" | "outline";
  isLoading?: boolean;
};

export function Button({
  title,
  variant = "solid",
  isLoading = false,
  ...rest
}: Props) {
  return (
    <GluestackButton
      w="$full"
      h="$14"
      bg={variant === "solid" ? "$green700" : "$transparent"}
      borderWidth={variant === "solid" ? "$0" : "$1"}
      borderColor="$green500"
      rounded="$md"
      $active-backgroundColor={variant === "solid" ? "$green500" : "$gray500"}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" />
      ) : (
        <Text
          color={variant === "solid" ? "$white" : "$green500"}
          fontFamily="$body"
          fontSize="$sm"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  );
}
