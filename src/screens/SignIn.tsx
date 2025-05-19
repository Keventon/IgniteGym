import {
  VStack,
  Image,
  Center,
  Text,
  Heading,
  ScrollView,
  useToast,
} from "@gluestack-ui/themed";

import BackgrundImg from "@assets/background.png";
import Logo from "../assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { BackHandler } from "react-native";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
};

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { signIn } = useAuth();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(
      yup.object({
        email: yup
          .string()
          .required("Informe o e-mail.")
          .email("E-mail inválido."),
        password: yup
          .string()
          .required("Informe a senha.")
          .min(6, "A senha deve ter pelo menos 6 dígitos."),
      })
    ),
  });

  function handleNavigateToSignUp() {
    navigation.navigate("SignUp");
  }

  async function handleLogin({ email, password }: FormData) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível entrar. Tente novamente mais tarde.";

      setIsLoading(false);

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

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          source={BackgrundImg}
          alt="Pessoas treinando"
          w="$full"
          h={624}
          defaultSource={BackgrundImg}
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />
            <Text color="$gray100" fontSize="$sm">
              Treine suamente e seu corpo.
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color="$gray100">Acesse sua conta</Heading>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  errorMessage={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Button
              title="Acessar"
              onPress={handleSubmit(handleLogin)}
              isLoading={isLoading}
            />
          </Center>

          <Center flex={1} justifyContent="flex-end" mb="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
              Ainda não tem acesso?
            </Text>
            <Button
              title="Criar conta"
              variant="outline"
              onPress={handleNavigateToSignUp}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
