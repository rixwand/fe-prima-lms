import { authService } from "@/services/auth.service";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";

export default function AvatarProfile() {
  const { data } = useSession();
  const getPfp = (pict?: string | null) => (!pict || pict == "user.jpg" ? `/images/${pict}` : pict);
  const logoutHandler = async () => {
    await authService.logout();
    await signOut({
      callbackUrl: "/",
    });
  };
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name={data?.user.name || "Username"}
          size="sm"
          src={getPfp(data?.user.image)}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{data?.user.email || "user@mail.com"}</p>
        </DropdownItem>
        <DropdownItem href="/dashboard" key="dashboard">
          Dashboard
        </DropdownItem>
        <DropdownItem key="profile">Profile</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem onPress={logoutHandler} key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
