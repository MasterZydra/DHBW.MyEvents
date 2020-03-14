const apiDoc = {
    swagger: '2.0',
    basePath: '/',
    info: {
        title: 'MyEvents - Find personalized music events with Spotify',
        version: '1.0.0'
    },
    definitions: {},
    paths: {
        "/authenticate": {
            parameters: [],
            get: {
                summary: "Redirects to authorization page of spotify for this app.",
                operationId: "getAuthenticate",
                parameters: [
                    {
                        in: "query",
                        name: "redirect_uri",
                        required: true,
                        type: "string",
                        description: "URL where Spotify is returning to."
                    }],
                responses: {
                    200: {
                        description: "Returns code from Spotify",
                        schema: {
                            type: "string"
                        }
                    },
                    default: {
                        description: "An error occurred",
                        schema: {
                            additionalProperties: true
                        }
                    }
                }
            }
        },
        "/getEvents": {
            parameters: [],
            post: {
                summary: "Get events based on your music taste and given location.",
                operationId: "postEvents",
                parameters: [
                    {
                        in: "header",
                        name: "location",
                        required: false,
                        type: "string",
                        description: "Location where the event will be searched"
                    },
                    {
                        in: "header",
                        name: "genres",
                        required: true,
                        type: "array",
                        items: {
                            type: "string"
                        },
                        description: "Genres for which events are searched."
                    },
                    {
                        in: "header",
                        name: "date",
                        required: false,
                        type: "string",
                        description: "Period in which to search."
                    },
                    {
                        in: "header",
                        name: "page_size",
                        required: false,
                        type: "integer",
                        description: "Maximum number of events. Default is 25."
                    }],
                responses: {
                    200: {
                        description: "A list of events with their details.",
                        schema: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string"
                                    },
                                    start_time: {
                                        type: "string"
                                    },
                                    venue_name: {
                                        type: "string"
                                    },
                                    venue_address: {
                                        type: "string"
                                    },
                                    description: {
                                        type: "string"
                                    },
                                    performers: {
                                        type: "object"
                                    },
                                    city_name: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    },
                    default: {
                        description: "An error occurred",
                        schema: {
                            additionalProperties: true
                        }
                    }
                }
            }
        },
        "/getGenres": {
            parameters: [],
            post: {
                summary: "Returns top listened music genres.",
                operationId: "postGenres",
                parameters: [
                    {
                        in: "header",
                        name: "access_token",
                        required: true,
                        type: "string",
                        description: "Access token from Spotify"
                    }],
                responses: {
                    200: {
                        description: "A list of genres according to listen behaviour of visitor.",
                        schema: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    },
                    default: {
                        description: "An error occurred",
                        schema: {
                            additionalProperties: true
                        }
                    }
                }
            }
        },
        "/getSpotifyAccessToken": {
            parameters: [],
            post: {
                summary: "Returns Spotify Access Token.",
                operationId: "postSpotifyAccessToken",
                parameters: [
                    {
                        in: "header",
                        name: "code",
                        required: true,
                        type: "string",
                        description: "Code from Spotify"
                    },
                    {
                        in: "header",
                        name: "redirect_uri",
                        required: true,
                        type: "string",
                        description: "URL where Spotify returns to."
                    }],
                responses: {
                    200: {
                        description: "Access token from Spotify.",
                        schema: {
                            type: "string"
                        }
                    },
                    default: {
                        description: "An error occurred",
                        schema: {
                            additionalProperties: true
                        }
                    }
                }
            }
        },
    }
};

module.exports = apiDoc;