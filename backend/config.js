let apiUrl = "http://localhost:3000";
module.exports = {
    apiUrl,
    spotify: {
        client_id: "905baa9c4a8c41b8868f961e19b1cc71",
        client_secret: "0085f87a56cb4e40a6a15e556c01ade9",
        scope: 'user-read-private user-read-email user-top-read',
        redirect_uri: apiUrl + "/callback"
    },
    eventfulKey: "rd6RC8JknxGKq89Q",
};