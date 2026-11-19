import "dotenv/config";

console.log("ENV CHECK:", {
    region: process.env.AWS_REGION,
    access: Boolean(process.env.AWS_ACCESS_KEY_ID),
    secret: Boolean(process.env.AWS_SECRET_ACCESS_KEY)
});

await import("./app.js");