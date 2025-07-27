import { inter, poppins } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import { Button, Input } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((isVisible) => !isVisible);
  };
  return (
    <div className="flex flex-row">
      <section
        className={cn([
          poppins.className,
          "bg-blue-800 hidden w-1/2 lg:flex flex-col items-center min-h-screen",
        ])}>
        <div className="flex flex-row items-center gap-x-2 h-fit mt-24">
          <h1
            className={cn([
              inter.className,
              "text-[10rem] font-bold text-white",
            ])}>
            #
          </h1>
          <h1 className="text-5xl font-bold text-white">
            GROW WITH <br /> <span className="text-8xl">PRIMA</span>
          </h1>
        </div>
        <h3
          className={cn([
            inter.className,
            "mt-auto mb-20 text-3xl text-white",
          ])}>
          wujudkan masa depan cerah
        </h3>
      </section>
      <section className="min-h-screen w-full lg:w-1/2 flex flex-col justify-center items-center bg-main">
        <div className="px-1 py-3.5 rounded-xl shadow-xl bg-white">
          <Image
            width={120}
            height={96}
            src="/images/logo-prima.png"
            alt="logo-prima"
          />
        </div>
        <div className="lg:w-3/4 xl:w-2/4 w-[80%] mt-12 flex flex-col items-center gap-5">
          <h2 className={cn([poppins.className, "text-2xl "])}>
            Hello! Welcome
          </h2>
          <Input
            label="Email Adress"
            type="email"
            variant="faded"
            size="lg"
            radius="lg"
            classNames={{
              inputWrapper: ["bg-white", "px-4"],
              innerWrapper: ["bg-white"],
              label: [inter.className, "text-lg"],
            }}
          />
          <Input
            label="Password"
            type={isVisible ? "text" : "password"}
            variant="faded"
            size="lg"
            radius="lg"
            classNames={{
              inputWrapper: ["bg-white", "px-4"],
              innerWrapper: ["bg-white"],
              label: [inter.className, "text-lg"],
            }}
            endContent={
              <button
                onClick={toggleVisibility}
                className="focus:outline-hidden mb-1 mr-1 cursor-pointer"
                type="button">
                {isVisible ? (
                  <FaEye className="text-2xl text-default-400" />
                ) : (
                  <FaEyeSlash className="text-2xl text-default-400" />
                )}
              </button>
            }
          />
          <a
            href="#"
            className={cn([poppins.className, "text-prime ml-auto mt-2"])}>
            Reset Password
          </a>
          <Button
            className={cn([
              inter.className,
              "text-2xl bg-prime text-white w-full py-7.5 rounded-3xl",
            ])}>
            Login
          </Button>
          <p className={cn([poppins.className])}>
            Don&apos;t Have an Account?
            <Link className="text-prime ml-2" href="/auth/register">
              Create Here
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
