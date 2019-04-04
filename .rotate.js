module.exports = {
    filter(data) {return data.req},
    output: {
        path:'logs/application.log',
        options: {
            size: "1M", // rotate every 10 MegaBytes written
            interval: "1d", // rotate daily
            compress: "gzip" // compress rotated files
          }
    }
}