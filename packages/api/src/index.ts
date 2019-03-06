import * as express from 'express'
import { CommitsService } from './services/index';
const app: express.Application = express();

app.get('/', function (req: express.Request, res: express.Response) {
  res.sendStatus(204);
}); 

app.get('/status', function (req, res) {
  res.status(200).json({
    status: 'ok'
  });
});

app.get('/commits', function (req, res) {
  res.status(200).json(CommitsService());
});
 
app.listen(3000)