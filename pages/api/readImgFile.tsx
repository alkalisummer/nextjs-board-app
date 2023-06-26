import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectStorageClient } from 'oci-objectstorage';
import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function readImgFile(request: NextApiRequest, response: NextApiResponse) {
  const param = request.body;
  const common = require('oci-common');

  const form = new formidable.IncomingForm({
    maxFiles: 5 * 1024 * 1024 * 1024, // 최대 파일 크기 지정
    keepExtensions: true,
  });

  const { fileData, fields }: { fileData: any; fields: any } = await new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      maxFiles: 5 * 1024 * 1024, // 최대 파일 크기 지정
      keepExtensions: true,
    });

    form.parse(request, (error, fields, files) => {
      if (error) return reject(error);
      return resolve({
        fileData: files,
        fields: fields,
      });
    });
  });

  fs.readFileSync(fileData);

  console.log(param);

  const imgFile = param.buffer || param.stream;
  const provider = new common.ConfigFileAuthenticationDetailsProvider('../config');
  const objectStorageClient = new ObjectStorageClient({ authenticationDetailsProvider: provider });

  const namespace = process.env.CLOUD_BUCKET_NAME_SPACE;
  const bucketName = process.env.CLOUD_BUCKET_NAME;
  const objectName = param.name;

  const putObjectRequest = {
    namespaceName: namespace!,
    bucketName: bucketName!,
    objectName: 'pasteImage4',
    putObjectBody: imgFile,
  };

  const putObjectResponse = await objectStorageClient.putObject(putObjectRequest);
  console.log(putObjectResponse);

  return response.status(200).json(putObjectResponse);
}
