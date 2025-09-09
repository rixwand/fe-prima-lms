import { getErrorMessage } from "@/libs/axios/error";
import userService from "@/services/user.service";
import { AppAxiosError } from "@/types/axios";
import { addToast } from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const useSetting = () => {
  const [user, setUser] = useState<IGetUser | undefined>(undefined);
  const {
    data: query,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryFn: userService.me,
    queryKey: ["user"],
  });

  const {
    control: userControl,
    handleSubmit: userHandleSubmit,
    reset: userReset,
  } = useForm({
    defaultValues: { fullName: "", profilePict: "" },
    resolver: yupResolver(updateUserScheme),
  });

  const {
    mutate: mutateUser,
    isPending: isPendingUser,
    data: res,
    status: statusUser,
  } = useMutation({
    mutationFn: userService.update,
    onError: error =>
      addToast({
        title: "Perubahan gagal tersimpan",
        color: "danger",
        description: error.message,
      }),
    onSuccess: () => {
      addToast({
        color: "success",
        title: "Perubahan tersimpan",
      });
    },
  });

  useEffect(() => {
    if (isSuccess) setUser(query.data.data);
  }, [isSuccess, query]);

  useEffect(() => {
    if (statusUser == "success") setUser(res.data.data);
  }, [statusUser, res]);

  useEffect(() => {
    if (user)
      userReset({
        fullName: user?.fullName,
        profilePict: user?.profilePict,
      });
  }, [user, userReset]);

  const handleUserUpdate = ({ fullName, profilePict }: IUpdateUser) => {
    const updateData: IUpdateUser = {
      ...(fullName == user?.fullName ? {} : { fullName }),
      ...(profilePict == user?.profilePict ? {} : { profilePict }),
    };
    if (Object.keys(updateData).length < 1) {
      addToast({
        color: "success",
        title: "Perubahan tersimpan",
      });
      return;
    }
    return mutateUser(updateData);
  };

  // Update Password
  const {
    control: passwordControl,
    reset: passwordReset,
    handleSubmit: passwordHandleSubmit,
  } = useForm({
    resolver: yupResolver(updatePasswordSchema),
  });

  const resetPasswordService = async (payload: IUpdatePassword) => {
    try {
      await userService.updatePassword(payload);
    } catch (e) {
      throw new Error(getErrorMessage(e as AppAxiosError));
    }
  };

  const { isPending: isPendingPassword, mutate: mutatePassword } = useMutation({
    mutationFn: resetPasswordService,
    onSuccess: () => {
      passwordReset({
        newPassword: "",
        oldPassword: "",
      });
      addToast({
        title: "Perubahan password tersimpan",
        color: "success",
      });
    },
    onError: error =>
      addToast({
        title: "Perubahan password gagal",
        color: "danger",
        description: error.message,
      }),
  });

  const handlePasswordUpdate = (data: IUpdatePassword) => mutatePassword(data);

  return {
    handlePasswordUpdate,
    isPendingPassword,
    passwordControl,
    passwordHandleSubmit,
    userControl,
    isPendingUser,
    handleUserUpdate,
    userHandleSubmit,
    user,
    isLoading,
    isError,
  };
};

export default useSetting;

const updateUserScheme = yup.object({
  fullName: yup.string().required("Silahkan masukkan Nama lengkap"),
  profilePict: yup.string().required(),
});

const updatePasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[0-9]/, "Password must contain at least one number"),
  oldPassword: yup.string().required(),
});
