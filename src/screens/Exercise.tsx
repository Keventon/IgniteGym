import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ArrowLeft } from "lucide-react-native";
import { Platform, ScrollView, TouchableOpacity } from "react-native";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt={Platform.OS === "ios" ? "$16" : "$12"}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            Puxada frontal
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p="$8">
          <Image
            w="$full"
            h="$80"
            mb="$3"
            alt="Puxada frontal"
            resizeMode="cover"
            rounded="$lg"
            source={{
              uri: "https://s2-oglobo.glbimg.com/WyvC_yuCqntB5JjnFP1cTdrVvpk=/0x0:1339x1181/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2022/0/j/2NMxiNQ7aFEpXwjk5aCA/exercicio004-copia.jpg",
            }}
          />

          <Box bg="$gray600" px="$4" rounded="$md" pb="$4">
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb="$6"
              mt="$5"
            >
              <HStack alignItems="center">
                <SeriesSvg />
                <Text color="$gray200" ml="$2">
                  3 series
                </Text>
              </HStack>

              <HStack alignItems="center">
                <RepetitionsSvg />
                <Text color="$gray200" ml="$2">
                  12 repetições
                </Text>
              </HStack>
            </HStack>

            <Button title="Marcar como realizado" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
