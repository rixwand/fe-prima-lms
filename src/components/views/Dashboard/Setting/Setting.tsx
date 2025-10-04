import TextField from "@/components/commons/TextField";
import { Avatar, Button, Skeleton, Spinner } from "@heroui/react";
import { ReactNode } from "react";
import { Controller } from "react-hook-form";
import { IoIosSave } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import useSetting from "./useSetting";

export default function Setting() {
  const {
    userControl,
    user,
    isError,
    handleUserUpdate,
    userHandleSubmit,
    isPendingUser,
    handlePasswordUpdate,
    passwordHandleSubmit,
    passwordControl,
    isPendingPassword,
    isLoading,
  } = useSetting();
  if (isError) {
    return;
  }
  return (
    <div className="w-full text-slate-700">
      <div className="mb-5 gap-6">
        <div className="flex-1 space-y-6">
          {/* Profile Settings */}
          <form onSubmit={userHandleSubmit(handleUserUpdate)}>
            <Section title="Profil">
              <Row>
                <p className="lg:w-1/5">Avatar</p>
                <section className="w-fit h-fit relative">
                  {isLoading ? (
                    <Skeleton className="rounded-full w-24 h-24" />
                  ) : (
                    <Avatar
                      src={`/images/${user?.profilePict}`}
                      classNames={{
                        base: ["w-24 h-24"],
                      }}
                    />
                  )}
                  <button
                    type="button"
                    className="p-1 text-white bg-blue-600 absolute -right-1 cursor-pointer -bottom-1 border-2 border-blue-100 rounded-full">
                    <MdEdit size={24} />
                  </button>
                </section>
              </Row>
              <Row>
                <p className="lg:w-1/5">Username</p>
                <section className="grow">
                  <TextField isLoading={isLoading} disabled id="username" defaultValue={user?.username} />
                </section>
              </Row>
              <Row>
                <p className="lg:w-1/5">Email</p>
                <section className="grow">
                  <TextField isLoading={isLoading} id="email" disabled type="email" defaultValue={user?.email} />
                </section>
              </Row>
              <Row>
                <p className="lg:w-1/5">Nama Lengkap</p>
                <section className="grow">
                  <Controller
                    control={userControl}
                    name="fullName"
                    render={({ field, fieldState: { error } }) => (
                      <TextField id="fullName" isLoading={isLoading} error={error?.message} field={field} />
                    )}
                  />
                </section>
              </Row>
              {/* <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Simpan Perubahan
              </button> */}
              <Button
                disabled={isPendingUser}
                type="submit"
                className="font-semibold text-white rounded-lg px-4 h-fit py-2 bg-blue-600 text-sm">
                {isPendingUser ? <Spinner size="sm" color="white" /> : <IoIosSave size={18} />}
                Simpan
              </Button>
            </Section>
          </form>

          {/* Security Settings */}
          <form onSubmit={passwordHandleSubmit(handlePasswordUpdate)}>
            <Section title="Keamanan">
              <Row>
                <p className="lg:w-1/5">Password baru</p>
                <section className="grow">
                  <Controller
                    control={passwordControl}
                    name="newPassword"
                    render={({ field, fieldState: { error } }) => (
                      <TextField id="newPassword" error={error?.message} type="password" field={field} />
                    )}
                  />
                </section>
              </Row>
              <Row>
                <p className="lg:w-1/5">Konfirmasi password</p>
                <section className="grow">
                  <Controller
                    control={passwordControl}
                    name="oldPassword"
                    render={({ field, fieldState: { error } }) => (
                      <TextField id="oldPassword" error={error?.message} type="password" field={field} />
                    )}
                  />
                </section>
              </Row>
              <Button
                disabled={isPendingPassword}
                type="submit"
                className="font-semibold text-white rounded-lg px-4 h-fit py-2 bg-blue-600 text-sm">
                {isPendingPassword ? <Spinner size="sm" color="white" /> : <IoIosSave size={18} />}
                Ubah Password
              </Button>
            </Section>
          </form>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">{title}</h2>
      <div className="lg:space-y-5 space-y-4">{children}</div>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex space-y-2 flex-col lg:flex-row">{children}</div>;
}
