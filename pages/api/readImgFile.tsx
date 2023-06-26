import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectStorageClient } from 'oci-objectstorage';
import { IncomingForm } from 'formidable';
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

  const form = new IncomingForm();

  await new Promise((resolve, reject) => {
    form.parse(request, (err, fields, files) => {
      if (err) {
        reject(response.status(500).json({ result: err }));
      } else {
        resolve(files);
      }
    });
  }).then(async (res: any) => {
    const provider = new common.ConfigFileAuthenticationDetailsProvider('../config');
    const objectStorageClient = new ObjectStorageClient({ authenticationDetailsProvider: provider });

    const namespace = process.env.CLOUD_BUCKET_NAME_SPACE;
    const bucketName = process.env.CLOUD_BUCKET_NAME;
    const objectName = res.file[0].originalFilename;

    const filePath = res.file[0].filepath;

    const putObjectRequest = {
      namespaceName: namespace!,
      bucketName: bucketName!,
      objectName: objectName,
      contentLength: res.file[0].size,
      putObjectBody: fs.readFileSync(filePath),
    };

    const putObjectResponse = await objectStorageClient.putObject(putObjectRequest);

    return response.status(200).json(putObjectResponse);
  });
}
