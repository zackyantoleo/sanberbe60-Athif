import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import path from "path";

export default function docs(app: Express) {
  app.use("/docs", swaggerUi.serve);
  app.get(
    "/docs",
    swaggerUi.setup(swaggerOutput, {
      swaggerOptions: {
        url: "/swagger_output.json",
      },
      customCssUrl: "/swagger-ui/swagger-ui.css",
      customJs: "/swagger-ui/swagger-ui-bundle.js",
      customSiteTitle: "API Documentation",
    })
  );

  // Serve swagger_output.json
  app.get("/swagger_output.json", (req, res) => {
    res.sendFile(path.join(__dirname, "swagger_output.json"));
  });
}
