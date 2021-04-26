import config from "@src/config";
import UserRepository from "@src/repository/UserRepository";
import { UpdateUserValidator } from "@src/validator/users/UpdateUser";
import AWS from "aws-sdk";
import { validate } from 'class-validator';
import fs from "fs";
import mime from 'mime';

/**
 * Verification user
 * @param id id của object
 * @param data FormData user
 */
export const updateUserBusiness = async (id: string, data: UpdateUserValidator): Promise<any> => {
  try {
    const validation = await validate(data);
    if (validation.length !== 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    }
    console.log(data);
    const userRes = new UserRepository();
    const user = await userRes.findById(id);
    if (user) {
      if (data.avatar) {
        const file = await uploadFile(data.avatar);
        await userRes.updateById(user.id, { ...data, avatar: file.Location });
        return file.Location;
      } else {
        await userRes.updateById(user.id, { ...data, avatar: null });
        return true;
      }
    }
  } catch (err) {
    throw err;
  }
};

export const uploadFile = (file): Promise<AWS.S3.ManagedUpload.SendData> => {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({
      accessKeyId: config.S3_ACCESS_KEY,
      secretAccessKey: config.S3_ACCESS_SECRET
    });
    const fileContent = fs.readFileSync(file.path);
    const extension = mime.extension(file.mimetype);
    const fileName = file.filename;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: config.S3_BUCKET,
      Key: `${fileName}.${extension}`,
      Body: fileContent,
      ACL: 'public-read'
    };

    s3.upload(params, function (err, data: AWS.S3.ManagedUpload.SendData) {
      if (err) {
        reject(err.message);
      } else {
        resolve(data);
      }
    });
  });
};