import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const cloudinaryAvatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blogAuthors",
    },
});

const cloudinaryBlogStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blogImages",
    },
});

export function uploadAvatarImageToCloud(req, res, next) {
  const upload = multer({ storage: cloudinaryAvatarStorage }).single("avatar");
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      throw new Error(err);
    } else {
      next();
    }
  });
}

export function uploadBlogImageToCloud(req, res, next) {
  const upload = multer({ storage: cloudinaryBlogStorage }).single("cover");
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      throw new Error(err);
    } else {
      next();
    }
  });
}
