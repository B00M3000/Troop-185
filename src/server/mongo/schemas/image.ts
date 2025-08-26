/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import mongoose from "mongoose";
import crypto from 'crypto';
import { deleteObject, uploadObject } from '@/server/aws';

interface ImageDocumentData {
    type: string;
    s3ObjectKey: string;
    size: number;
    associatedResourceTag: string;
}

const schema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        s3ObjectKey: { type: String, required: false },
        size: { type: Number, required: true },
        associatedResourceTag: { type: String, required: true },
    },
    { timestamps: true },
);

export type ImageDocument = mongoose.HydratedDocument<ImageDocumentData>;

export const ImageSchema: mongoose.Model<ImageDocumentData> =
    mongoose.models["Images"] || mongoose.model("Images", schema);

import { AWS_S3_IMAGES_SUBFOLDER } from "$env/static/private";

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
    await uploadObject(filename, imageBuffer);

    const image = await ImageSchema.create({
        type: imageType,
        s3ObjectKey: filename,
        size: imageBuffer.length,
        associatedResourceTag,
    });

    return image._id.toString();
}

export async function uploadEventImage(dataUrl: string, eventId: string) {
    return uploadImage(dataUrl, `event:${eventId}`);
}

// Delete all images associated with an event
export async function deleteEventImages(eventId: string) {
    const images = await ImageSchema.find({
        associatedResourceTag: `event:${eventId}`
    });

    await Promise.all(images.map(image => deleteObject(image.s3ObjectKey)));

    await ImageSchema.deleteMany({
        associatedResourceTag: `event:${eventId}`
    });

    return images.length;
}