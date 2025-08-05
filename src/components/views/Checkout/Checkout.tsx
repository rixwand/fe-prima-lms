import { quicksand } from "@/libs/fonts";
import cn from "@/libs/utils/cn";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import { PiInfoBold } from "react-icons/pi";

export default function Checkout() {
  return (
    <div className="w-full min-h-screen items-center flex flex-col justify-center relative">
      <h1 className="mb-6 text-center text-2xl font-semibold text-gray-600">
        Pembayaran untuk Kursus Microsoft Office Word
      </h1>
      <Card
        className={cn([
          quicksand.className,
          "lg:w-[47rem] lg:mx-0 mx-4 lg:text-lg shadow-sm border-abu border text-[#3F3F46]",
        ])}>
        <CardHeader className="px-6 py-5 border-b border-abu">
          <p className="font-semibold">Harga Kursus</p>
        </CardHeader>
        <CardBody className="px-6 py-5 border-b border-abu">
          <span className="flex justify-between pb-3">
            <p className="font-semibold w-4/5">
              Menjadi Admin Profesional : Microsoft Office Word
            </p>
            <p className="line-through text-nowrap">Rp 850.000</p>
          </span>
          <span className="flex justify-between pb-4 border-abu">
            <p>Diskon 15%</p>
            <p>Rp 550.000</p>
          </span>
          <Divider />
          <div className="space-y-4 my-4">
            <span className="flex items-center gap-x-2">
              <p className="font-semibold">Kode Promo</p>
              <PiInfoBold size={22} />
            </span>
            <p>Bayar lebih hemat degan promo</p>
            {/* <Button></Button> */}
            <span className="lg:w-3/4 w-11/12 flex items-center gap-x-4">
              <Input
                classNames={{
                  innerWrapper: ["px-1"],
                }}
                placeholder="Masukkan kode promo"
                radius="sm"
                variant="bordered"
                size="lg"
              />
              <Button className="bg-abu lg:text-lg py-5.5 font-semibold rounded-sm px-7">
                Terapkan
              </Button>
            </span>
          </div>
        </CardBody>
        <CardFooter className="flex-col py-5 px-6">
          <span className="flex justify-between w-full pb-3">
            <p className="font-semibold">Jumlah Tagihan</p>
            <p className="font-semibold">Rp 550.000</p>
          </span>
          <p className="text-prime text-start w-full text-base">
            Lihat metode pembayaran yang tersedia
          </p>
          <Button className="bg-[#1E40AF] ml-auto mt-5 lg:text-xl lg:py-5.5 text-white font-bold rounded-sm lg:px-8">
            Bayar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
