module.exports = {
  getProxy: (server) => {
    return {
      "/service/api/v1": {
        target: "http:127.0.0.1:5000",
        changeOrigin: true,
      },
    };
  },
};
