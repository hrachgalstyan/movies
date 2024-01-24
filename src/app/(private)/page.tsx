import { cache } from "react";
import { db } from "../../../prisma";
import EmptyList from "@/components/EmptyList";
import MoviesList from "@/components/MoviesList";

const PER_PAGE = 8;

const moviesCount = cache(() => db.movie.count());
const getMovies = cache((currentPage: number) =>
  db.movie.findMany({
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
  })
);

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const count = await moviesCount();
  const movies = await getMovies(Number(searchParams?.page) || 1);
  return (
    <main className="flex mx-auto max-w-screen-xl px-4 py-32 min-h-screen">
      {count === 0 ? (
        <EmptyList />
      ) : (
        <MoviesList movies={movies} allCount={count} />
      )}
    </main>
  );
}
