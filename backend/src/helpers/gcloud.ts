import { format } from 'util';
import processFile from '../middlewares/upload';
import { Storage } from '@google-cloud/storage';
import {pipeline, Readable} from "stream";
import * as fs from "fs";

const initGCloud = () => {

    const hash = process.env.GCLOUD_HASH;
    const privateKeyEnv = process.env.GC_PRIVATE_KEY || '';
    const privateKey = privateKeyEnv.replace(/\\\n/g, '\n');

    const storage = new Storage({
        projectId: process.env.GC_PROJECT_ID,
        credentials: {
            client_email: process.env.GC_CLIENT_EMAIL,
            private_key: privateKey,
        },
    });

    const bucket = storage.bucket(process.env.GCLOUD_BUCKET || '');
    return {hash, bucket};
};

export const uploadGCloud = async (folder: string, filename: string, req: any, res: any, targetFolder: string) => {
    try {
        const {hash, bucket} = initGCloud();
        await processFile(req, res);
        // let buffer = await req.file.buffer;

        if (!req.file) {
            return res.status(400).send({message: 'Please upload a file!'});
        }

        let path = `${hash}/${folder}/${filename}`;
        let blob = bucket.file(path);


        // const blobStream = blob.createWriteStream({
        //     resumable: false,
        // });

        fs.createReadStream(`${targetFolder}/${filename}`)
            .pipe(blob.createWriteStream())
            .on('error', function(err) {
                console.log('Upload error');
                console.log(err.message);
                res.status(500).send({message: err.message});
            })
            .on('finish', function() {
                const publicUrl = format(
                    `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
                );

                res.status(200).send({
                    message: 'Uploaded the file successfully: ' + path,
                    url: publicUrl,
                });
            });

        // console.log(blobStream)

        // blobStream.on('error', (err: Error) => {
        //     console.log('Upload error');
        //     console.log(err.message);
        //     res.status(500).send({message: err.message});
        // });

        // console.log(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);

        // blobStream.on('finish', async () => {
        //     const publicUrl = format(
        //         `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        //     );
        //
        //     res.status(200).send({
        //         message: 'Uploaded the file successfully: ' + path,
        //         url: publicUrl,
        //     });
        // });

        // blobStream.end(req.file.buffer);
    } catch (err) {
        console.log(err);

        res.status(500).send({
            message: `Could not upload the file. ${err}`,
        });
    }
};

export const downloadGCloud = async (privateUrl: string) => {
    const {hash, bucket} = initGCloud();

    const filePath = `${hash}/${privateUrl}`;

    const file = await bucket.file(filePath);
    const fileExists = await file.exists();

    if (fileExists[0]) {
        return file;
    } else {
        return undefined;
    }
};

export const deleteGCloud = async (privateUrl: string) => {
    try {
        const {hash, bucket} = initGCloud();
        const filePath = `${hash}/${privateUrl}`;

        const file = bucket.file(filePath);
        const fileExists = await file.exists();

        if (fileExists[0]) {
            file.delete();
        }
    } catch (err) {
        console.log(`Cannot find the file ${privateUrl}`);
    }
};

