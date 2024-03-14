/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "0.0.0.0", "storage.googleapis.com"],
  },
};
