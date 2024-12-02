export default  {
    port: process.env.PORT,
    jwtSecret: process.env.SECRET_KEY,
    mongoUrl: process.env.MONGO_URL,
    refreshSecret:process.env.REFRESH_SECRET_KEY
}