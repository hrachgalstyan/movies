import Link from "next/link";
import { memo } from "react";

const EmptyList = () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center gap-[40px]">
      <p className="text-5xl text-center font-semibold leading-[56px] text-white">
        Your movie list is empty
      </p>
      <Link href={"/movie/new"}>
        <button className="bg-primary text-white w-[202px] h-[56px] rounded-[10px] text-[16px] leading-[24px] text-center font-bold">
          Add movies
        </button>
      </Link>
    </div>
  );
};

export default memo(EmptyList);
