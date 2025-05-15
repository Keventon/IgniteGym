import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, Text, VStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { SectionList } from "react-native";

export function History() {
  const [exercices, setExercises] = useState([
    {
      title: "22.06.2025",
      data: ["Puxada frontal", "Remada unilateral"],
    },
    {
      title: "21.06.2025",
      data: ["Supino reto", "Remada curvada"],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        showsVerticalScrollIndicator={false}
        sections={exercices}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
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
    </VStack>
  );
}
