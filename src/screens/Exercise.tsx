import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ArrowLeft } from "lucide-react-native";
import {
  BackHandler,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/exerciseDTO";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const [isLoading, setIsLoading] = useState(true);
  const [submitRegisterLoading, setSubmitRegisterLoading] = useState(false);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();

  const toast = useToast();

  const { exerciseId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível carregar os detalhes do exercício.";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSubmitRegisterLoading(true);

      await api.post("/history", { exercise_id: exerciseId });

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Parabéns! Exercício registrado no seu histórico."
            onClose={() => toast.close(id)}
          />
        ),
      });

      navigation.navigate("History");
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível registrar o exercício como concluído.";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setSubmitRegisterLoading(false);
    }
  }

  if (!(BackHandler as any).removeEventListener) {
    (BackHandler as any).removeEventListener = (
      eventName: string,
      handler: () => boolean
    ) => {};
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

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
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
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
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
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
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack alignItems="center">
                  <RepetitionsSvg />
                  <Text color="$gray200" ml="$2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado"
                isLoading={submitRegisterLoading}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
