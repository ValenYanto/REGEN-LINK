import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
    url: "/openapi.json",
    theme: "kepler",
    metaData: {
        title: "REGEN-LINK API Documentation",
        description:
            "Interactive API documentation for the REGEN-LINK climate action platform.",
    },
});