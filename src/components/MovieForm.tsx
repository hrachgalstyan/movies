"use client";

import { Movie } from "@prisma/client";
import Image from "next/image";
import {
  ChangeEvent,
  DragEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import TrashIcon from "@/assets/images/trash.svg";
import UploadIcon from "@/assets/images/upload.svg";
import Input from "./Input";
import { redirect, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createEditMovie } from "@/app/(private)/movie/[id]/action";
import { FormState, Maybe } from "@/util/types";
import { FormLoading } from "./FormLoading";

interface MovieFormData {
  title: string;
  publishedYear: string;
  imageUrl: string | Blob;
}

interface Props {
  movie?: Maybe<Movie>;
  id: string;
}

const initialState: FormState<MovieFormData> = {
  success: null,
};

const MovieForm: FC<Props> = ({ movie, id }) => {
  const router = useRouter();
  const [image, setImage] = useState<Blob | string>(movie?.imageUrl || "");

  const [state, formAction] = useFormState<FormState<MovieFormData>, FormData>(
    createEditMovie,
    initialState
  );

  console.log({ state });

  useEffect(() => {
    if (state.success) {
      redirect("/");
    }
  }, [state.success]);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.backgroundColor = "rgb(34 73 87)";
    setImage(event.dataTransfer.files[0]);
  }, []);

  const onDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.backgroundColor = "rgb(34 73 87)";
  }, []);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.[0] || "");
  }, []);

  const onRemoveImage = useCallback(() => {
    setImage("");
  }, []);

  const handleCancel = useCallback(() => router.back(), [router]);

  const handleAction = useCallback(
    (formData: FormData) => {
      formData.append("imageUrl", image);
      formData.append("id", id !== "new" ? id : "");
      formData.append("key", movie?.imageUrl?.split(".")[0] || "");
      formAction(formData);
    },
    [formAction, id, image, movie?.imageUrl]
  );
  const timeStamp = Date.now();
  return (
    <form action={handleAction} className="movie_form">
      <div className="image">
        <div
          onDrop={onDrop}
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          className={`w-full max-h-[504px] min-h-[372px] h-full border-2 border-dashed  ${
            state.form?.imageUrl ? "border-error" : "border-white"
          } rounded-[10px] bg-input overflow-hidden flex justify-center`}
        >
          <div className="relative w-full h-full flex flex-col justify-center items-center bg-[transparent] gap-[8px]">
            {image && (
              <Image
                src={
                  typeof image === "string"
                    ? `${
                        process.env.NEXT_PUBLIC_AWS_BUCKET_URL
                      }${image}?${Date.now()}`
                    : URL.createObjectURL(image)
                }
                className="absolute inset-0 h-full  object-contain"
                width={600}
                height={600}
                alt={"movie_image"}
                priority={true}
              />
            )}
            <input
              type={"file"}
              className="absolute inset-0 opacity-0 border-0"
              accept="image/*"
              onChange={onChange}
            />
            <Image src={UploadIcon} width={24} height={24} alt="upload" />
            <p className="text-sm leading-[24px] text-white font-normal">
              Drop an image here
            </p>
          </div>
        </div>

        {state.form?.imageUrl && (
          <p className="text-xs font-normal mt-2 text-error">
            {state.form?.imageUrl}
          </p>
        )}
        {image && (
          <p
            onClick={onRemoveImage}
            className="mt-5 flex justify-center items-center cursor-pointer text-white"
          >
            <Image src={TrashIcon} alt={""} width={48} height={48} />
            Delete
          </p>
        )}
      </div>

      <div className="inputs">
        <Input
          className="w-full h-full px-4 text-sm rounded-[10px] bg-secondary  text-white border border-solid border-secondary appearance-none outline-none"
          wrapperClassName="w-full h-[45px]"
          type={"text"}
          name="title"
          placeholder={"Title"}
          error={state.form?.title}
          defaultValue={movie?.title}
        />
        <Input
          className="w-full h-full px-4 text-sm rounded-[10px] bg-secondary text-white border border-solid border-secondary appearance-none outline-none"
          wrapperClassName="w-[216px] h-[45px]"
          type={"text"}
          placeholder={"Publishing year"}
          name="publishedYear"
          error={state.form?.publishedYear}
          defaultValue={movie?.publishedYear}
        />
      </div>
      <div className="buttons">
        <button
          type="button"
          onClick={handleCancel}
          className="border border-white border-solid text-white w-full h-[54px] rounded-[10px] text-[16px] leading-[24px] text-center font-bold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-white w-full h-[54px] rounded-[10px] text-[16px] leading-[24px] text-center font-bold"
        >
          {movie ? "Update" : "Submit"}
        </button>
      </div>
      <FormLoading />
    </form>
  );
};

export default memo(MovieForm);
