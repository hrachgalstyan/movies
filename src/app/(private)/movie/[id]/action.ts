"use server";

import { transformYupErrorsIntoObject } from "@/util/helpers";
import { Form, FormState } from "@/util/types";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { revalidatePath } from "next/cache";
import * as yup from "yup";
import { db } from "../../../../../prisma";
import { Readable } from "stream";

const client = new S3Client({ region: process.env.AWS_REGION });

const movieSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  publishedYear: yup
    .string()
    .required("Publishing year is required")
    .test("is-valid-year", "Invalid year format", function (value) {
      if (!value) {
        return true; // Accept empty or undefined values
      }

      // Regular expression to check if the value is a valid year (four digits)
      const isValidYear = /^\d{4}$/.test(value);

      return isValidYear;
    }),
  imageUrl: yup
    .mixed<Blob | string>()
    .test("required", "Image is required", function (value) {
      return !!value;
    })
    .test("is-image", "Invalid image type", function (value) {
      if (typeof value === "string" || value instanceof Blob) {
        return true;
      }
      return false;
    })
    .required("Image is required"),
});

export const createEditMovie = async <T>(
  prevState: FormState<T>,
  formData: FormData
) => {
  try {
    const { title, publishedYear, imageUrl } = await movieSchema.validate(
      {
        title: formData.get("title"),
        publishedYear: formData.get("publishedYear"),
        imageUrl: formData.get("imageUrl"),
      },
      { abortEarly: false }
    );
    const id = formData.get("id");
    const key = formData.get("key") as string;
    let fileUrl = imageUrl;

    if (typeof fileUrl !== "string") {
      fileUrl = await uploadImage(key || Date.now().toString(), fileUrl);
    }

    await db.movie.upsert({
      create: {
        imageUrl: fileUrl,
        title,
        publishedYear,
      },
      update: {
        imageUrl: fileUrl,
        title,
        publishedYear,
      },
      where: { id: Number(id) },
    });

    if (!id) {
      return { success: true, message: "Movie Created Successfully" };
    } else {
      return { success: true, message: "Movie Edited Successfully" };
    }
  } catch (err: any) {
    if (err.errors) {
      const validationErrors = transformYupErrorsIntoObject<T>(err);
      return { success: false, message: "", form: validationErrors };
    }
    console.log(err);
    return { success: false, message: "Error" };
  }
};

export const uploadImage = async (key: string, file: Blob) => {
  const mime = file.type.split("/")[1];
  const arrayBuffer = await file.arrayBuffer();
  const fileBase64 = Buffer.from(arrayBuffer).toString("base64");
  const fileBuffer = Buffer.from(fileBase64, "base64");

  const fileStream = new Readable();
  fileStream.push(fileBuffer);
  fileStream.push(null);

  const uploader = new Upload({
    client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: `${key}.${mime}`,
      ContentType: file.type,
      Body: fileStream,
      ACL: "public-read",
    },
  });

  return uploader.done().then((res) => `${key}.${mime}`);
};
