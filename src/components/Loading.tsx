import { Center, Spinner } from "@gluestack-ui/themed";
import { StatusBar } from "react-native";

export function Loading() {
  return (
    <Center flex={1} bg="$gray700">
      <StatusBar barStyle="light-content" />
      <Spinner size="large" color="$green500" />
    </Center>
  );
}
