import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import path from "path";

export default function docs(app: Express) {
  const options = {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.js",
    ],
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput, options));
}
