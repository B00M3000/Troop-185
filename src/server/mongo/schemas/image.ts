/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import mongoose from "mongoose";
import crypto from 'crypto';
import { uploadObject } from '@/server/aws';

interface ImageDocumentData {
    type: string;
    s3Bucket: string;
    s3ObjectKey: string;
    size: number;
    associatedResourceTag: string;
}

const schema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        s3Bucket: { type: String, required: true },
        s3ObjectKey: { type: String, required: false },
        size: { type: Number, required: true },
        associatedResourceTag: { type: String, required: true },
    },
    { timestamps: true },
);

export type ImageDocument = mongoose.HydratedDocument<ImageDocumentData>;

export const ImageSchema: mongoose.Model<ImageDocumentData> =
    mongoose.models["Images"] || mongoose.model("Images", schema);

import { AWS_S3_BUCKET } from "$env/static/private";

export async function uploadImage(dataUrl: string, associatedResourceTag: string) {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z]*);base64,(.*)$/);

    if (!matches) {
        throw new Error(`Invalid image data URL`);
    }

    const imageType = matches[1];
    const imageData = matches[2];
    const imageBuffer = Buffer.from(imageData, 'base64');

    const timestamp = Date.now();
    const randomId = crypto.randomUUID();
    const filename = `${timestamp}-${randomId}.${imageType}`;

    // Upload to S3
    await uploadObject(AWS_S3_BUCKET, filename, imageBuffer);

    const image = await ImageSchema.create({
        type: imageType,
        s3Bucket: AWS_S3_BUCKET,
        s3ObjectKey: filename,
        size: imageBuffer.length,
        associatedResourceTag,
    });

    return image._id.toString();
}