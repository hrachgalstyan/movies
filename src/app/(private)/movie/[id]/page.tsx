import { Movie } from "@prisma/client";
import { cache } from "react";
import { db } from "../../../../../prisma";
import { redirect } from "next/navigation";
import MovieForm from "@/components/MovieForm";

const getMovie = cache((id: number) => db.movie.findUnique({ where: { id } }));

export default async function Movie({ params }: { params: { id: string } }) {
  let movie: Movie | null = null;

  if (params.id && params.id !== "new") {
    try {
      movie = await getMovie(Number(params.id));
      if (!movie) {
        redirect("/404");
      }
    } catch (err) {
      redirect("/404");
    }
  }

  return (
    <main className="flex flex-col mx-auto max-w-screen-xl px-6 py-[80px] lg:py-[120px]  min-h-screen">
      <h2 className="text-white">
        {params.id === "new" ? "Create a new movie" : "Edit"}
      </h2>
      <div className="flex flex-1 pt-[80px] lg:pt-[120px]">
        <MovieForm movie={movie} id={params.id} />
      </div>
    </main>
  );
}
