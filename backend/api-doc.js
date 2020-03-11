const apiDoc = {
    swagger: '2.0',
    basePath: '/',
    info: {
        title: 'MyEvents - Events matching your music taste',
        version: '1.0.0'
    },
    definitions: {
    },
    paths: {
        "/authenticate": {
            parameters:[],
            post: {
                summary: "Returns worlds by name.",
                operationId:"postWorlds",
                parameters: [
                    {
                        in: "query",
                        name:"worldName",
                        required:true,
                        type:"string"
                    }],
                responses: {
                    200: {
                        description:"A list of worlds that match the requested name.",
                        schema:{
                            type:"array",
                            items:{
                                "$ref":"#/definitions/World"
                            }
                        }
                        },
                    default: {
                        description: "An error occurred",
                        schema: {
                            additionalProperties:true
                        }
                    }
                }
            }
        },
        "/getEvents": {
            parameters:[],
            post: {
                summary: "Get events based on your music taste and given location.",
                operationId:"postEvents",
                parameters: [
                    {
                        in: "header",
                        name: "location",
                        required: false,
                        type: "string",
                        description: "Location where the event will be searched"
                    },
                    {
                        in: "query",
                        name:"genres",
                        required:true,
                        type:"array",
                        items: {
                            type: "string"
                        },
                        description: "Genres for which events are searched"
                    },
                    {
                        in: "query",
                        name: "date",
                        required: false,
                        type: "string",
                        description: "Period in which to search"
                    },
                    {
                        in: "query",
                        name:"page_size",
                        required: false,
                        type: "integer",
                        description: "Maximum number of events. Default is 25."
                    }],
                responses: {
                    200: {
                        description:"A list of events with their details.",
                        schema:{
                            type:"array",
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
                            additionalProperties:true
                        }
                    }
                }
            }
        },
        "/getGenres": {
            parameters:[],
            post: {
                summary: "Returns worlds by name.",
                operationId:"postWorlds",
                parameters: [
                    {
                        in: "query",
                        name:"worldName",
                        required:true,
                        type:"string"
                    }],
                responses: {
                    200: {
                        description:"A list of worlds that match the requested name.",
                        schema:{
                            type:"array",
                            items:{
                                "$ref":"#/definitions/World"
                            }
                        }
                    },
                    default: {
                        description: "An error occurred",
                        schema: {
                            additionalProperties:true
                        }
                    }
                }
            }
        },
        "/getSpotifyAccessToken": {
            parameters:[],
            post: {
                summary: "Returns worlds by name.",
                operationId:"postWorlds",
                parameters: [
                    {
                        in: "query",
                        name:"worldName",
                        required:true,
                        type:"string"
                    }],
                responses: {
                    200: {
                        description:"A list of worlds that match the requested name.",
                        schema:{
                            type:"array",
                            items:{
                                "$ref":"#/definitions/World"
                            }
                        }
                    },
                    default: {
                        description: "An error occurred",
                        schema: {
                            additionalProperties:true
                        }
                    }
                }
            }
        },
    }
};

module.exports = apiDoc;