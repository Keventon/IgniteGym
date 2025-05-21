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
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useAuth } from "@hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { removeAccentsAndSpecialChars } from "@utils/removeAccentAndSpecialChars";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";

const changePerfilSchema = yup.object({
  name: yup.string().optional(),
  email: yup.string().optional(),
  password: yup
    .string()
    .min(6, "A senha tem que ter no mínimo 6 digitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  old_password: yup
    .string()
    .min(6, "A senha tem que ter no mínimo 6 digitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas precisam ser iguais.")
    .nullable()
    .transform((value) => (!!value ? value : null))
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .required("Informe a confirmação da senha.")
          .required("Informe a confirmação da senha.")
          .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  const [image, setImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(changePerfilSchema),
  });

  if (!(BackHandler as any).addEventListener) {
    (BackHandler as any).addEventListener = (
      eventName: string,
      handler: () => boolean
    ) => {};
  }

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoUri = photoSelected.assets[0].uri;

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

        const fileExtension = photoUri.split(".").pop();
        const userName = user.name.trim().split(" ").join("-");

        const photoFile = {
          name: `${removeAccentsAndSpecialChars(
            userName
          )}.${fileExtension}`.toLowerCase(),
          uri: photoUri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        const avatarUpdatedResponse = await api.patch(
          "/users/avatar",
          userPhotoUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        await updateProfile(userUpdated);

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Foto atualizada!"
              action="success"
              onClose={() => toast.close(id)}
            />
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleProfileUpdate = async (data: any) => {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);
      await updateProfile(userUpdated);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Perfil atualizado!"
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível atualizar o perfil. Tente novamente mais tarde.";

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
      setIsUpdating(false);
    }
  };

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : defaultUserPhotoImg
            }
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
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value}
                  isReadOnly
                />
              )}
            />
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
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  secureTextEntry
                  bg="$gray600"
                  onChangeText={onChange}
                  errorMessage={errors.old_password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova senha"
                  secureTextEntry
                  bg="$gray600"
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirme a senha"
                  secureTextEntry
                  bg="$gray600"
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button
              title="Atualizar"
              isLoading={isUpdating}
              onPress={handleSubmit(handleProfileUpdate)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
