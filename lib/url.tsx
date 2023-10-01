const hostUrl = process.env.ENVIRONMENT === "DEVELOPMENT" ? process.env.DEVELOPMENT_URL : "ELSE";

export default hostUrl