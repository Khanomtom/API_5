import express from "express";
import { router as movie } from "./api/movie";
import { router as person} from "./api/person";
import { router as star} from "./api/star";
import { router as creater} from "./api/creater";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser.json())
app.use('/movie',movie);
app.use('/person',person);
app.use('/star',star);
app.use('/creater',creater);