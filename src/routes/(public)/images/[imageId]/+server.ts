/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { getObject } from "@/server/aws";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { error } from "@sveltejs/kit";

export async function GET({ params: { imageId }, setHeaders }) {
    const image = await ImageSchema.findById(imageId);

    if (!image)
        error(404, { message: `Could not find image with id ${imageId}` });

    setHeaders({
        "Cache-Control": "public, max-age=1209600", // two weeks cache
    });

    const object = await getObject(image.s3Bucket, image.s3ObjectKey);

    return new Response(object?.Body, {
        status: 200,
        headers: { "Content-Type": image.type },
    });
}