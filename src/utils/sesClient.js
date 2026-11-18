import { SESClient } from "@aws-sdk/client-ses";
const REGION = "ap-southeast-2";
const sesClient = new SESClient({ region: REGION ,
    accessKeyId:process.env.AWS_SES_ACCESS,
    secretAccessKey:process.env.AWS_SES_SECRET
});
export default sesClient ;