/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import path from 'path';
import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import type {
    PutObjectCommandOutput,
    GetObjectCommandOutput,
    DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";

import {
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_IMAGES_SUBFOLDER
} from "$env/static/private";

console.log({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
})

let client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export async function uploadObject(
    bucket: string,
    key: string,
    fileBuffer: Buffer,
): Promise<PutObjectCommandOutput> {
    console.log(AWS_S3_IMAGES_SUBFOLDER)
    return client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: AWS_S3_IMAGES_SUBFOLDER != "/" ? path.join(AWS_S3_IMAGES_SUBFOLDER, key) : key,
            Body: fileBuffer,
        }),
    );
}

export async function getObject(
    bucket: string,
    key: string,
): Promise<GetObjectCommandOutput> {
    return client.send(
        new GetObjectCommand({
            Bucket: bucket,
            Key: AWS_S3_IMAGES_SUBFOLDER != "/" ? path.join(AWS_S3_IMAGES_SUBFOLDER, key) : key,
        }),
    );
}

export async function deleteObject(
    bucket: string,
    key: string,
): Promise<DeleteObjectCommandOutput> {
    return client.send(
        new DeleteObjectCommand({
            Bucket: bucket,
            Key: AWS_S3_IMAGES_SUBFOLDER != "/" ? path.join(AWS_S3_IMAGES_SUBFOLDER, key) : key,
        }),
    );
}