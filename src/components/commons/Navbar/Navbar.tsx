import {
  Navbar as Nav,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { title: "Kursus", link: "/course" },
    { title: "Ulasan", link: "#review" },
    { title: "Tentang", link: "#review" },
  ];
  return (
    <Nav maxWidth="2xl" isBordered onMenuOpenChange={setMenuOpen}>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
        <NavbarBrand className="mr-4">
          <Image
            src="/images/logo-full.png"
            alt="brand logo"
            height={34}
            width={128}
          />
        </NavbarBrand>
        <NavbarContent className="hidden lg:flex gap-10 mr-4">
          {menuItems.map((val) => (
            <NavbarItem key={val.title}>
              <Link color="foreground" href={val.link}>
                {val.title}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Input
          className="sm:flex hidden mr-3"
          variant="bordered"
          radius="sm"
          classNames={{
            base: "max-w-full sm:max-w-[35rem]",
            inputWrapper: "h-full text-default-500 px-4",
          }}
          placeholder="Apa yang ingin anda pelajari?"
          startContent={<FaSearch size={18} />}
          type="search"
        />
        <Button
          onPress={() => {
            router.push("/auth/login");
          }}
          className="hidden lg:flex text-medium rounded-lg py-4.5 px-6 font-semibold"
          variant="bordered">
          Masuk
        </Button>
        <Button
          className="bg-prime text-white text-medium sm:rounded-lg px-6 py-4.5 font-semibold"
          onPress={() => {
            router.push("/auth/register");
          }}>
          Daftar
        </Button>
        {/* <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="md"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={item.title}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href={item.link}
              size="lg">
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Nav>
  );
}
