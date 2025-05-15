import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useState } from "react";
import { FlatList } from "react-native";

export function Home() {
  const [exercices, setExercises] = useState<string[]>([
    "Puxada frontal",
    "Remada unilateral",
    "Supino reto",
    "Remada curvada",
    "Triceps com barra",
    "Flexão de braço",
    "Flexão de cotovelo",
  ]);
  const [groups, setGroups] = useState<string[]>([
    "Costas",
    "Bíceps",
    "Tríceps",
    "Ombro",
  ]);
  const [groupSelected, setGroupSelected] = useState("costas");

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails() {
    navigation.navigate("Exercise");
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={groups}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{
          marginVertical: 40,
          maxHeight: 44,
          minHeight: 44,
        }}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
      />

      <VStack px="$8" flex={1}>
        <HStack justifyContent="space-between" alignItems="center" mb="$5">
          <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercícios
          </Heading>
          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercices.length}
          </Text>
        </HStack>

        <FlatList
          data={exercices}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ExerciseCard title={item} onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      </VStack>
    </VStack>
  );
}
