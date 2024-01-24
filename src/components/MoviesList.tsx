"use client";

import { Movie } from "@prisma/client";
import Image from "next/image";
import { FC, memo, useCallback } from "react";
import AddIcon from "@/assets/images/add.svg";
import LogoutIcon from "@/assets/images/logout.svg";
import Link from "next/link";
import { Pagination } from "./Pagination";
import { signOut } from "next-auth/react";

interface Props {
  movies: Array<Movie>;
  allCount: number;
}

const PER_PAGE = 8;

const MoviesList: FC<Props> = ({ movies, allCount }) => {
  const handleLogOut = useCallback(() => signOut({ redirect: true }), []);
  return (
    <div className="flex flex-1 flex-col justify-between items-center gap-[120px]">
      <section className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <h2 className="text-white">My movies</h2>
          <Link href={"/movie/new"}>
            <Image src={AddIcon} width={32} height={32} alt={"Add"} />
          </Link>
        </div>
        <button
          onClick={handleLogOut}
          className="flex flex-row gap-3 items-center text-[16px] leading-[24px] text-white font-bold"
        >
          Logout
          <Image src={LogoutIcon} alt={"logout"} width={32} height={32} />
        </button>
      </section>
      <section className="grid md:grid-cols-4 grid-cols-2 gap-6 h-full">
        {movies?.map((movie) => (
          <Link
            href={`/movie/${movie.id}`}
            className="flex flex-col max-w-[282px] h-[334px] lg:h-[504px] min-w-[180px] min-h-[334px] w-full items-start px-2 pt-2 pb-4 rounded-[12px] bg-card backdrop-blur-[100px] hover:bg-cardHover"
            key={movie.id}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}${
                movie.imageUrl
              }?${Date.now()}`}
              width={266}
              height={400}
              className="w-full h-full rounded-[12px] object-cover"
              alt={movie.title}
            />
            <div className="flex flex-col gap-2 px-4 pt-4  ">
              <p className="text-sm sm:text-xl sm:leading-8 text-white">
                {movie.title}
              </p>
              <p className="text-sm text-white">{movie.publishedYear}</p>
            </div>
          </Link>
        ))}
      </section>
      <section>
        <Pagination count={allCount} perPage={PER_PAGE} showedItems={movies} />
      </section>
    </div>
  );
};

export default memo(MoviesList);
