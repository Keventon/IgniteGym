import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { BackHandler, ScrollView, TouchableOpacity } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { ToastMessage } from "../components/ToastMessage";

export function Profile() {
  const [image, setImage] = useState<string | null>(null);

  const toast = useToast();

  if (!(BackHandler as any).removeEventListener) {
    (BackHandler as any).removeEventListener = (
      eventName: string,
      handler: () => boolean
    ) => {
      console.warn(
        "BackHandler.removeEventListener está obsoleto. Use subscription.remove()"
      );
    };
  }

  async function handleUserPhotoSelect() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const photoUri = result.assets[0].uri;

      if (photoUri) {
        const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Escolha uma imagem com no máximo 5MB"
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        setImage(photoUri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={image || "https://github.com/keventon.png"}
            alt="Foto de perfil"
            size="xl"
          />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Input placeholder="Nome" bg="$gray600" />
            <Input value="keventon@gmail.com" bg="$gray600" isReadOnly />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            fontSize="$md"
            mt="$12"
            mb="$2"
            color="$gray200"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Input placeholder="Senha antiga" secureTextEntry bg="$gray600" />
            <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
            <Input
              placeholder="Confirme a nova senha"
              bg="$gray600"
              secureTextEntry
            />

            <Button title="Atualizar" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
