import { readFileSync } from 'fs';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router = Router();

const swaggerDocument = JSON.parse(
  readFileSync(new URL('../docs/swagger.json', import.meta.url)),
);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;
