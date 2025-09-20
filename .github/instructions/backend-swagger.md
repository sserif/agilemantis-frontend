{
  "openapi": "3.0.1",
  "info": {
    "title": "AgileMantis API",
    "description": "A comprehensive API for Agile project management with team collaboration features. This API provides endpoints for managing teams, health checks, and other core functionality.",
    "contact": {
      "name": "AgileMantis Team",
      "email": "support@agilemantis.com"
    },
    "version": "v1"
  },
  "paths": {
    "/api/teams/{teamId}/projects/{projectId}": {
      "delete": {
        "tags": [
          "Projects"
        ],
        "summary": "Deletes a project within the specified team.\r\nAlso cleans up associated Azure OpenAI resources (vector store and assistant).",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID to delete",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      },
      "get": {
        "tags": [
          "Projects"
        ],
        "summary": "Retrieves a specific project by ID within the specified team.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ProjectResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Projects"
        ],
        "summary": "Updates an existing project within the specified team.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID to update",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "description": "The project update request",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.UpdateProjectRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.UpdateProjectRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.UpdateProjectRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ProjectResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "409": {
            "description": "Conflict",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects/{projectId}/documents/{documentId}": {
      "delete": {
        "tags": [
          "Projects"
        ],
        "summary": "Deletes a document from the project's vector store.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "documentId",
            "in": "path",
            "description": "The document ID to delete",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      },
      "get": {
        "tags": [
          "Projects"
        ],
        "summary": "Gets information about a specific document in the project's vector store.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "documentId",
            "in": "path",
            "description": "The document ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ProjectDocument"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/Health": {
      "get": {
        "tags": [
          "Health"
        ],
        "summary": "Health check endpoint that returns the current system health status",
        "parameters": [
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Returns when the system is healthy or degraded",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.HealthCheckResponse"
                }
              }
            }
          },
          "503": {
            "description": "Returns when the system is unhealthy",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.HealthCheckResponse"
                }
              }
            }
          },
          "500": {
            "description": "Returns when an internal error occurs",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/Teams": {
      "get": {
        "tags": [
          "Teams"
        ],
        "summary": "Gets all teams for the authenticated user.",
        "parameters": [
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Returns the list of teams the user belongs to",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/AgileMantis.Shared.Models.TeamResponse"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Returns when the user is not authenticated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Returns when an internal server error occurs",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ErrorResponse"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Teams"
        ],
        "summary": "Creates a new team for the authenticated user.",
        "parameters": [
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "description": "Team creation request data containing name and optional description.",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.CreateTeamRequest"
              },
              "example": "{\n    \"name\": \"Development Team Alpha\",\n    \"description\": \"Primary development team for the AgileMantis project\"\n}"
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.CreateTeamRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.CreateTeamRequest"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Returns the newly created team",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.TeamResponse"
                }
              }
            }
          },
          "400": {
            "description": "Returns when the request is invalid or validation fails",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ErrorResponse"
                }
              }
            }
          },
          "401": {
            "description": "Returns when the user is not authenticated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ErrorResponse"
                }
              }
            }
          },
          "409": {
            "description": "Returns when a team with the same name already exists",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ErrorResponse"
                }
              }
            }
          },
          "500": {
            "description": "Returns when an internal server error occurs",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects": {
      "get": {
        "tags": [
          "Projects"
        ],
        "summary": "Retrieves all projects for the specified team.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID to get projects for",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/AgileMantis.Shared.Models.ProjectResponse"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Projects"
        ],
        "summary": "Creates a new project within the specified team.\r\nProvisions Azure OpenAI vector store and assistant for the project.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID to create the project in",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "description": "The project creation request",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.CreateProjectRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.CreateProjectRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.CreateProjectRequest"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ProjectResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "409": {
            "description": "Conflict",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects/{id}/threads": {
      "get": {
        "tags": [
          "Projects"
        ],
        "summary": "Lists conversation threads for a project with cursor-based pagination for infinite scrolling.\r\nRetrieves historical conversations including metadata like message count and activity status.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Maximum number of threads to return (1-100, default: 20)",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 20
            }
          },
          {
            "name": "order",
            "in": "query",
            "description": "Sort order: 'asc' or 'desc' (default: 'desc')",
            "schema": {
              "type": "string",
              "default": "desc"
            }
          },
          {
            "name": "after",
            "in": "query",
            "description": "Cursor for pagination - get threads after this thread ID",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "before",
            "in": "query",
            "description": "Cursor for pagination - get threads before this thread ID",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ThreadListResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects/{projectId}/documents": {
      "get": {
        "tags": [
          "Projects"
        ],
        "summary": "Lists all documents in the project's vector store.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ListProjectDocumentsResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Projects"
        ],
        "summary": "Uploads a document to the project's vector store.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "description": "The document file to upload",
                    "format": "binary"
                  }
                }
              },
              "encoding": {
                "file": {
                  "style": "form"
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.UploadDocumentResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "413": {
            "description": "Content Too Large",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects/{projectId}/documents/{documentId}/status": {
      "get": {
        "tags": [
          "Projects"
        ],
        "summary": "Gets the current processing status of a document in the project's vector store.\r\nThis endpoint provides real-time status information for vector indexing monitoring.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "documentId",
            "in": "path",
            "description": "The document ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.DocumentProcessingStatusResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects/{projectId}/threads/{threadId}": {
      "get": {
        "tags": [
          "Projects"
        ],
        "summary": "Retrieves a specific conversation thread with all its messages.\r\nThis endpoint allows users to continue existing conversations by viewing the full message history.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "threadId",
            "in": "path",
            "description": "The thread ID to retrieve",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ThreadDetailResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects/{projectId}/threads/{threadId}/runs/{runId}": {
      "get": {
        "tags": [
          "Projects"
        ],
        "summary": "Gets the status and details of a specific thread run.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "threadId",
            "in": "path",
            "description": "The thread ID",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "runId",
            "in": "path",
            "description": "The run ID to check",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.RunResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/Health/advanced": {
      "post": {
        "tags": [
          "Health"
        ],
        "summary": "Advanced health check endpoint with customizable parameters",
        "parameters": [
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "description": "Health check parameters",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.HealthCheckRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.HealthCheckRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.HealthCheckRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects/{projectId}/chat": {
      "post": {
        "tags": [
          "Projects"
        ],
        "summary": "Starts or continues a chat conversation with the project's AI assistant.\r\nThe assistant has access to all documents uploaded to the project's vector store.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "description": "The chat request containing the user's message and optional thread ID",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.ChatRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.ChatRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.ChatRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.ChatResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/api/teams/{teamId}/projects/{projectId}/threads/{threadId}/runs": {
      "post": {
        "tags": [
          "Projects"
        ],
        "summary": "Creates a new run to continue a conversation thread.\r\nThis endpoint adds a user message to the thread and starts an assistant run to generate a response.",
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "description": "The team ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "projectId",
            "in": "path",
            "description": "The project ID",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "threadId",
            "in": "path",
            "description": "The thread ID to continue",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "X-Correlation-Id",
            "in": "header",
            "description": "Optional correlation ID for request tracking",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "description": "The run request with user message and optional instructions",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.RunRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.RunRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AgileMantis.Shared.Models.RunRequest"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AgileMantis.Shared.Models.RunResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Microsoft.AspNetCore.Mvc.ProblemDetails"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "AgileMantis.Shared.Enums.AgentContextStatus": {
        "enum": [
          0,
          1,
          2,
          3,
          4
        ],
        "type": "integer",
        "description": "Represents the status of an agent context provisioning.\r\nUsed for tracking AI assistant and vector store provisioning states.",
        "format": "int32"
      },
      "AgileMantis.Shared.Models.ChatRequest": {
        "required": [
          "message"
        ],
        "type": "object",
        "properties": {
          "message": {
            "maxLength": 4000,
            "minLength": 1,
            "type": "string",
            "description": "The user's message to send to the AI assistant. (Length: Message must be between 1 and 4000 characters)"
          },
          "threadId": {
            "type": "string",
            "description": "Optional existing thread ID to continue a conversation.\r\nIf not provided, a new conversation thread will be created.",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Request model for starting or continuing a chat conversation with a project's AI assistant."
      },
      "AgileMantis.Shared.Models.ChatResponse": {
        "required": [
          "response",
          "threadId",
          "userMessage"
        ],
        "type": "object",
        "properties": {
          "response": {
            "minLength": 1,
            "type": "string",
            "description": "The AI assistant's response to the user's message."
          },
          "threadId": {
            "minLength": 1,
            "type": "string",
            "description": "The thread ID for this conversation.\r\nUse this ID in subsequent messages to continue the same conversation."
          },
          "generatedAt": {
            "type": "string",
            "description": "Timestamp when the response was generated.",
            "format": "date-time"
          },
          "userMessage": {
            "minLength": 1,
            "type": "string",
            "description": "The original user message that prompted this response."
          },
          "isNewThread": {
            "type": "boolean",
            "description": "Indicates if this is the start of a new conversation thread."
          },
          "projectId": {
            "type": "string",
            "description": "The project ID this conversation belongs to.",
            "format": "uuid"
          },
          "metadata": {
            "type": "string",
            "description": "Optional metadata about the conversation or response generation.",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Response model for chat interactions with a project's AI assistant."
      },
      "AgileMantis.Shared.Models.CreateProjectRequest": {
        "required": [
          "name"
        ],
        "type": "object",
        "properties": {
          "name": {
            "maxLength": 100,
            "minLength": 1,
            "type": "string",
            "description": "The name of the project.\r\nMust be unique within the team. (Required: Project name is required.) (Length: Project name must be between 1 and 100 characters.)"
          },
          "description": {
            "maxLength": 500,
            "minLength": 0,
            "type": "string",
            "description": "Optional description of the project. (Length: Project description cannot exceed 500 characters.)",
            "nullable": true,
            "example": "A detailed description of the item"
          }
        },
        "additionalProperties": false,
        "description": "Request model for creating a new project within a team."
      },
      "AgileMantis.Shared.Models.CreateTeamRequest": {
        "required": [
          "name"
        ],
        "type": "object",
        "properties": {
          "name": {
            "maxLength": 100,
            "minLength": 1,
            "type": "string",
            "description": "Name of the team to create. Must be unique and between 1-100 characters. (Required: Team name is required.) (Length: Team name must be between 1 and 100 characters.)",
            "example": "Development Team Alpha"
          },
          "description": {
            "maxLength": 500,
            "minLength": 0,
            "type": "string",
            "description": "Optional description of the team. Maximum 500 characters. (Length: Description cannot exceed 500 characters.)",
            "nullable": true,
            "example": "A detailed description of the item"
          }
        },
        "additionalProperties": false,
        "description": "Request model for creating a new team.",
        "example": "{\n    \"name\": \"Development Team Alpha\",\n    \"description\": \"Primary development team responsible for core application features\"\n}"
      },
      "AgileMantis.Shared.Models.DependencyHealth": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the dependency",
            "nullable": true
          },
          "status": {
            "$ref": "#/components/schemas/AgileMantis.Shared.Models.HealthStatus"
          },
          "description": {
            "type": "string",
            "description": "Description of the dependency health",
            "nullable": true,
            "example": "A detailed description of the item"
          },
          "durationMs": {
            "type": "integer",
            "description": "Duration of the dependency check in milliseconds",
            "format": "int64"
          },
          "error": {
            "type": "string",
            "description": "Error message if dependency check failed",
            "nullable": true
          },
          "data": {
            "type": "object",
            "additionalProperties": { },
            "description": "Additional data about the dependency",
            "nullable": true
          },
          "isCritical": {
            "type": "boolean",
            "description": "Whether this dependency is critical for application operation"
          }
        },
        "additionalProperties": false,
        "description": "Health status of an individual dependency"
      },
      "AgileMantis.Shared.Models.DocumentProcessingStatusResponse": {
        "required": [
          "fileId",
          "fileName",
          "status"
        ],
        "type": "object",
        "properties": {
          "fileId": {
            "minLength": 1,
            "type": "string",
            "description": "The unique file ID in the Vector Store."
          },
          "fileName": {
            "minLength": 1,
            "type": "string",
            "description": "The filename of the document."
          },
          "status": {
            "minLength": 1,
            "type": "string",
            "description": "Current processing status of the document.\r\nPossible values: \"uploaded\", \"pending\", \"processing\", \"processed\", \"error\", \"failed\""
          },
          "statusDescription": {
            "type": "string",
            "description": "Human-readable description of the current status.",
            "nullable": true
          },
          "uploadedAt": {
            "type": "string",
            "description": "When the document was uploaded.",
            "format": "date-time"
          },
          "processingTimeSeconds": {
            "type": "integer",
            "description": "Estimated time since upload in seconds.",
            "format": "int32"
          },
          "isComplete": {
            "type": "boolean",
            "description": "Indicates if processing is complete (either successfully or with errors)."
          },
          "isReadyForQueries": {
            "type": "boolean",
            "description": "Indicates if the document is ready for use in vector queries."
          },
          "errorMessage": {
            "type": "string",
            "description": "Any error message if document processing failed.",
            "nullable": true
          },
          "details": {
            "type": "string",
            "description": "Additional details about the processing progress.",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Response model for document processing status in vector indexing."
      },
      "AgileMantis.Shared.Models.ErrorResponse": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "description": "Human-readable error message.",
            "nullable": true
          },
          "code": {
            "type": "string",
            "description": "Error code for programmatic handling.",
            "nullable": true
          },
          "validationErrors": {
            "type": "object",
            "additionalProperties": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "description": "Validation errors, if any. Key is the field name, value is array of error messages.",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Standardized error response model for API operations.",
        "example": "{\n    \"message\": \"Validation failed for one or more fields\",\n    \"code\": \"VALIDATION_ERROR\",\n    \"validationErrors\": {\n        \"Name\": [\"Team name is required.\"]\n    }\n}"
      },
      "AgileMantis.Shared.Models.HealthCheckRequest": {
        "type": "object",
        "properties": {
          "includeDependencies": {
            "type": "boolean",
            "description": "Whether to include detailed dependency information"
          },
          "includeMetadata": {
            "type": "boolean",
            "description": "Whether to include metadata in the response"
          },
          "timeoutMs": {
            "type": "integer",
            "description": "Maximum time to wait for dependency checks in milliseconds",
            "format": "int32"
          },
          "dependencies": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Specific dependencies to check (empty means check all)",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Health check request model for advanced health checks"
      },
      "AgileMantis.Shared.Models.HealthCheckResponse": {
        "type": "object",
        "properties": {
          "status": {
            "$ref": "#/components/schemas/AgileMantis.Shared.Models.HealthStatus"
          },
          "timestamp": {
            "type": "string",
            "description": "Timestamp when the health check was performed",
            "format": "date-time"
          },
          "version": {
            "type": "string",
            "description": "Application version information",
            "nullable": true
          },
          "environment": {
            "type": "string",
            "description": "Application environment (Development, Staging, Production)",
            "nullable": true
          },
          "durationMs": {
            "type": "integer",
            "description": "Duration of the health check in milliseconds",
            "format": "int64"
          },
          "dependencies": {
            "type": "object",
            "additionalProperties": {
              "$ref": "#/components/schemas/AgileMantis.Shared.Models.DependencyHealth"
            },
            "description": "Health status of individual dependencies",
            "nullable": true
          },
          "metadata": {
            "type": "object",
            "additionalProperties": { },
            "description": "Additional metadata about the health check",
            "nullable": true
          },
          "errors": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Error messages if health check failed",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Standardized health check response model"
      },
      "AgileMantis.Shared.Models.HealthStatus": {
        "enum": [
          0,
          1,
          2
        ],
        "type": "integer",
        "description": "Health status enumeration",
        "format": "int32"
      },
      "AgileMantis.Shared.Models.ListProjectDocumentsResponse": {
        "required": [
          "documents"
        ],
        "type": "object",
        "properties": {
          "documents": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AgileMantis.Shared.Models.ProjectDocument"
            },
            "description": "List of documents in the project."
          },
          "totalCount": {
            "type": "integer",
            "description": "Total number of documents in the project.",
            "format": "int32"
          },
          "totalSizeBytes": {
            "type": "integer",
            "description": "Total size of all documents in bytes.",
            "format": "int64"
          }
        },
        "additionalProperties": false,
        "description": "Response model for listing project documents."
      },
      "AgileMantis.Shared.Models.ProjectDocument": {
        "required": [
          "fileId",
          "fileName",
          "status",
          "uploadedBy"
        ],
        "type": "object",
        "properties": {
          "fileId": {
            "minLength": 1,
            "type": "string",
            "description": "The unique file ID in the Vector Store."
          },
          "fileName": {
            "minLength": 1,
            "type": "string",
            "description": "The original filename of the uploaded document."
          },
          "fileSizeBytes": {
            "type": "integer",
            "description": "The size of the file in bytes.",
            "format": "int64"
          },
          "uploadedAt": {
            "type": "string",
            "description": "When the document was uploaded.",
            "format": "date-time"
          },
          "uploadedBy": {
            "minLength": 1,
            "type": "string",
            "description": "The Auth0 user ID who uploaded the document."
          },
          "contentType": {
            "type": "string",
            "description": "The MIME type of the document.",
            "nullable": true
          },
          "status": {
            "minLength": 1,
            "type": "string",
            "description": "Current status of the document in the Vector Store."
          },
          "errorMessage": {
            "type": "string",
            "description": "Any error message if document processing failed.",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Represents a document stored in a project's Vector Store."
      },
      "AgileMantis.Shared.Models.ProjectResponse": {
        "required": [
          "createdAt",
          "id",
          "isActive",
          "name",
          "teamId",
          "updatedAt"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "The unique identifier of the project.",
            "format": "uuid",
            "example": "123e4567-e89b-12d3-a456-426614174000"
          },
          "name": {
            "type": "string",
            "description": "The name of the project.",
            "nullable": true
          },
          "description": {
            "type": "string",
            "description": "Optional description of the project.",
            "nullable": true,
            "example": "A detailed description of the item"
          },
          "teamId": {
            "type": "string",
            "description": "The unique identifier of the team this project belongs to.",
            "format": "uuid"
          },
          "vectorStoreId": {
            "type": "string",
            "description": "The Azure OpenAI vector store ID for this project.\r\nUsed for document storage and retrieval.",
            "nullable": true
          },
          "assistantId": {
            "type": "string",
            "description": "The Azure OpenAI assistant ID for this project.\r\nUsed for AI-powered interactions.",
            "nullable": true
          },
          "agentContextStatus": {
            "$ref": "#/components/schemas/AgileMantis.Shared.Enums.AgentContextStatus"
          },
          "createdAt": {
            "type": "string",
            "description": "Timestamp when the project was created.",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "description": "Timestamp when the project was last updated.",
            "format": "date-time"
          },
          "isActive": {
            "type": "boolean",
            "description": "Indicates whether the project is active."
          }
        },
        "additionalProperties": false,
        "description": "Response model for project information."
      },
      "AgileMantis.Shared.Models.RunRequest": {
        "required": [
          "message"
        ],
        "type": "object",
        "properties": {
          "message": {
            "maxLength": 4000,
            "minLength": 1,
            "type": "string",
            "description": "The user's message to add to the thread before creating the run. (Length: Message must be between 1 and 4000 characters)"
          },
          "instructions": {
            "maxLength": 2000,
            "minLength": 0,
            "type": "string",
            "description": "Optional additional instructions for the assistant during this run. (Length: Instructions must not exceed 2000 characters)",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Request model for creating a new run to continue a conversation thread."
      },
      "AgileMantis.Shared.Models.RunResponse": {
        "required": [
          "runId",
          "status",
          "threadId"
        ],
        "type": "object",
        "properties": {
          "runId": {
            "minLength": 1,
            "type": "string",
            "description": "The unique run identifier."
          },
          "threadId": {
            "minLength": 1,
            "type": "string",
            "description": "The thread ID this run belongs to."
          },
          "status": {
            "minLength": 1,
            "type": "string",
            "description": "Current status of the run (queued, in_progress, completed, failed, etc.)."
          },
          "createdAt": {
            "type": "string",
            "description": "When the run was created.",
            "format": "date-time"
          },
          "startedAt": {
            "type": "string",
            "description": "When the run was started (if applicable).",
            "format": "date-time",
            "nullable": true
          },
          "completedAt": {
            "type": "string",
            "description": "When the run completed (if applicable).",
            "format": "date-time",
            "nullable": true
          },
          "assistantId": {
            "type": "string",
            "description": "The assistant ID handling this run.",
            "nullable": true
          },
          "projectId": {
            "type": "string",
            "description": "The project ID this run belongs to.",
            "format": "uuid"
          },
          "instructions": {
            "type": "string",
            "description": "Instructions provided to the assistant for this run.",
            "nullable": true
          },
          "errorMessage": {
            "type": "string",
            "description": "Error details if the run failed.",
            "nullable": true
          },
          "userMessage": {
            "type": "string",
            "description": "The user message that was added to the thread before creating this run.",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Response model for creating a new thread run."
      },
      "AgileMantis.Shared.Models.TeamResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the team.",
            "format": "uuid",
            "example": "123e4567-e89b-12d3-a456-426614174000"
          },
          "name": {
            "type": "string",
            "description": "Name of the team.",
            "nullable": true,
            "example": "Development Team Alpha"
          },
          "description": {
            "type": "string",
            "description": "Optional description of the team.",
            "nullable": true,
            "example": "A detailed description of the item"
          },
          "ownerId": {
            "type": "string",
            "description": "Auth0 user ID of the team owner.",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "description": "Timestamp when the team was created.",
            "format": "date-time"
          },
          "userRole": {
            "type": "string",
            "description": "The role of the current user in this team (Owner, Member).",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Response model for team operations.",
        "example": "{\n    \"id\": \"123e4567-e89b-12d3-a456-426614174000\",\n    \"name\": \"Development Team Alpha\",\n    \"description\": \"Primary development team responsible for core application features\",\n    \"ownerId\": \"auth0|507f1f77bcf86cd799439011\",\n    \"createdAt\": \"2024-01-15T10:30:00Z\"\n}"
      },
      "AgileMantis.Shared.Models.ThreadDetailResponse": {
        "required": [
          "messages",
          "thread"
        ],
        "type": "object",
        "properties": {
          "thread": {
            "$ref": "#/components/schemas/AgileMantis.Shared.Models.ThreadInfo"
          },
          "messages": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AgileMantis.Shared.Models.ThreadMessage"
            },
            "description": "All messages in the thread, ordered chronologically."
          },
          "projectId": {
            "type": "string",
            "description": "The project ID this thread belongs to.",
            "format": "uuid"
          }
        },
        "additionalProperties": false,
        "description": "Response model for retrieving a specific thread with all its messages."
      },
      "AgileMantis.Shared.Models.ThreadInfo": {
        "required": [
          "threadId"
        ],
        "type": "object",
        "properties": {
          "threadId": {
            "minLength": 1,
            "type": "string",
            "description": "The unique thread identifier."
          },
          "createdAt": {
            "type": "string",
            "description": "When the thread was created.",
            "format": "date-time"
          },
          "lastActivityAt": {
            "type": "string",
            "description": "When the thread was last active (last message sent).",
            "format": "date-time",
            "nullable": true
          },
          "messageCount": {
            "type": "integer",
            "description": "Total number of messages in the thread.",
            "format": "int32"
          },
          "firstMessage": {
            "type": "string",
            "description": "Preview of the first user message that started the conversation.",
            "nullable": true
          },
          "lastMessage": {
            "type": "string",
            "description": "Preview of the most recent message in the conversation.",
            "nullable": true
          },
          "isActive": {
            "type": "boolean",
            "description": "Indicates if the thread is still active (can receive new messages)."
          },
          "projectId": {
            "type": "string",
            "description": "The project ID this thread belongs to.",
            "format": "uuid"
          }
        },
        "additionalProperties": false,
        "description": "Information about a conversation thread in a project."
      },
      "AgileMantis.Shared.Models.ThreadListResponse": {
        "required": [
          "threads"
        ],
        "type": "object",
        "properties": {
          "threads": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AgileMantis.Shared.Models.ThreadInfo"
            },
            "description": "List of conversation threads."
          },
          "projectId": {
            "type": "string",
            "description": "The project ID these threads belong to.",
            "format": "uuid"
          },
          "hasMore": {
            "type": "boolean",
            "description": "Indicates if there are more threads available after the current page."
          },
          "limit": {
            "type": "integer",
            "description": "The limit used for this request.",
            "format": "int32"
          },
          "nextCursor": {
            "type": "string",
            "description": "Cursor pointing to the start of the next page (use as 'after' parameter).",
            "nullable": true
          },
          "previousCursor": {
            "type": "string",
            "description": "Cursor pointing to the start of the previous page (use as 'before' parameter).",
            "nullable": true
          },
          "order": {
            "type": "string",
            "description": "The order used for this request (asc or desc).",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Response model for listing conversation threads in a project."
      },
      "AgileMantis.Shared.Models.ThreadMessage": {
        "required": [
          "content",
          "messageId",
          "role"
        ],
        "type": "object",
        "properties": {
          "messageId": {
            "minLength": 1,
            "type": "string",
            "description": "The unique message identifier."
          },
          "content": {
            "minLength": 1,
            "type": "string",
            "description": "The content of the message."
          },
          "role": {
            "minLength": 1,
            "type": "string",
            "description": "The role of the message sender (user, assistant, system)."
          },
          "createdAt": {
            "type": "string",
            "description": "When the message was created.",
            "format": "date-time"
          },
          "userId": {
            "type": "string",
            "description": "The user who sent the message (if role is user).",
            "nullable": true
          },
          "metadata": {
            "type": "string",
            "description": "Optional metadata associated with the message.",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Represents a single message in a conversation thread."
      },
      "AgileMantis.Shared.Models.UpdateProjectRequest": {
        "required": [
          "name"
        ],
        "type": "object",
        "properties": {
          "name": {
            "maxLength": 100,
            "minLength": 1,
            "type": "string",
            "description": "The updated name of the project.\r\nMust be unique within the team. (Required: Project name is required.) (Length: Project name must be between 1 and 100 characters.)"
          },
          "description": {
            "maxLength": 500,
            "minLength": 0,
            "type": "string",
            "description": "Optional updated description of the project. (Length: Project description cannot exceed 500 characters.)",
            "nullable": true,
            "example": "A detailed description of the item"
          }
        },
        "additionalProperties": false,
        "description": "Request model for updating an existing project."
      },
      "AgileMantis.Shared.Models.UploadDocumentResponse": {
        "required": [
          "fileId",
          "fileName",
          "status"
        ],
        "type": "object",
        "properties": {
          "fileId": {
            "minLength": 1,
            "type": "string",
            "description": "The unique file ID assigned by the Vector Store."
          },
          "fileName": {
            "minLength": 1,
            "type": "string",
            "description": "The original filename that was uploaded."
          },
          "fileSizeBytes": {
            "type": "integer",
            "description": "The size of the uploaded file in bytes.",
            "format": "int64"
          },
          "uploadedAt": {
            "type": "string",
            "description": "When the upload completed.",
            "format": "date-time"
          },
          "status": {
            "minLength": 1,
            "type": "string",
            "description": "Current processing status of the document."
          },
          "message": {
            "type": "string",
            "description": "Optional message about the upload.",
            "nullable": true
          }
        },
        "additionalProperties": false,
        "description": "Response model for successful document upload operations."
      },
      "Microsoft.AspNetCore.Mvc.ProblemDetails": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "nullable": true
          },
          "title": {
            "type": "string",
            "nullable": true
          },
          "status": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "detail": {
            "type": "string",
            "nullable": true
          },
          "instance": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": { }
      }
    },
    "securitySchemes": {
      "Bearer": {
        "type": "http",
        "description": "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below. Example: 'Bearer 12345abcdef'",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "Bearer": [ ]
    }
  ]
}