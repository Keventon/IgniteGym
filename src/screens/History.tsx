import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { ToastMessage } from "@components/ToastMessage";
import { HistoryByDayDTO } from "@dtos/historyByDayDTO";
import { Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useCallback, useState } from "react";
import { BackHandler, SectionList } from "react-native";

export function History() {
  const [exercices, setExercises] = useState<HistoryByDayDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  async function fetchHistory() {
    try {
      const response = await api.get("/history");
      setExercises(response.data);
      setIsLoading(false);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível carregar o histórico.";

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

  if (!(BackHandler as any).removeEventListener) {
    (BackHandler as any).removeEventListener = (
      eventName: string,
      handler: () => boolean
    ) => {};
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={exercices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color="$gray200"
              fontSize="$md"
              mt="$10"
              mb="$3"
              fontFamily="$heading"
            >
              {section.title}
            </Heading>
          )}
          style={{ paddingHorizontal: 32 }}
          contentContainerStyle={
            exercices.length === 0 && {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }
          }
          ListEmptyComponent={() => (
            <Text color="$gray100" textAlign="center">
              Não há exercícios registrados ainda. {"\n"} Vamos fazer exercícios
              hoje?
            </Text>
          )}
        />
      )}
    </VStack>
  );
}
