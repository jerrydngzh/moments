const { randomUUID } = new ShortUniqueId({ length: 10 });
const { Storage } = require('@google-cloud/storage')
const dotenv = require("dotenv");
dotenv.config();

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: `keys/${process.env.GCS_KEY_FILENAME}`,
})
const bucket = storage.bucket(process.env.BUCKET_NAME)

export const uploadFiles = async (files) => {
    let fileNames = []
    try {
        if (!files) {
            console.log("Received 0 files.")
            return []
        }

        const uploadPromises = []
        let count = 0

        req.files.forEach(file => {
            const fileName = `${randomUUID()}-${file.originalname}`
            fileNames.push(fileName)
            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream();

            uploadPromises.push(new Promise((resolve, reject) => {
                blobStream.on("finish", () => {
                    console.log("Upload completed: " + file.originalname)
                    count++
                    resolve()
                });
                blobStream.on("error", () => reject())
            }))
            blobStream.end(file.buffer);
        })

        await Promise.all(uploadPromises)
        return fileNames
    } catch (error) {
        throw new Error("Cloud Storage Access Failed")
    }
};