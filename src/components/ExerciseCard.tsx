import {
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
};
export function ExerciseCard({ title, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: "https://s2-oglobo.glbimg.com/WyvC_yuCqntB5JjnFP1cTdrVvpk=/0x0:1339x1181/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2022/0/j/2NMxiNQ7aFEpXwjk5aCA/exercicio004-copia.jpg",
          }}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          mr="$3"
          rounded="$md"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {title}
          </Heading>
          <Text fontSize={"$sm"} color="$gray200" mt="$1" numberOfLines={2}>
            3 series x 12 repetições
          </Text>
        </VStack>
        <Icon as={ChevronRight} color="$gray300" size="md" />
      </HStack>
    </TouchableOpacity>
  );
}
