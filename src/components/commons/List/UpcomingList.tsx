import { Fragment } from "react";

type TProps = {
  title: string;
  tag: string;
};

type TPropsDs =
  | {
      day: string;
      month: string;
    }
  | {
      day?: never;
      month?: never;
    };

export default function UpcomingList({ tag, title, ...ds }: TProps & TPropsDs) {
  return (
    <div className="flex gap-4 items-center">
      <DateRelease {...ds} />
      <div className="flex flex-1 space-y-1 mb-1 flex-col">
        <span className="text-gray-500 line-clamp-1">{title}</span>
        <span className="text-tiny text-gray-600">{tag}</span>
      </div>
    </div>
  );
}

const DateRelease = ({ day, month }: TPropsDs) => {
  return (
    <div className="flex text-gray-500 items-center flex-col justify-center 2xl:w-14 w-12 h-12 2xl:h-14 text-xs bg-abu rounded-xl">
      {!day && !month ? (
        <p className="font-bold">?</p>
      ) : (
        <Fragment>
          <p className="font-bold">{day}</p>
          <p className="-mt-[2px]">{month}</p>
        </Fragment>
      )}
    </div>
  );
};
