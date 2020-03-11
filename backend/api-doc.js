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
        "/events": {
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