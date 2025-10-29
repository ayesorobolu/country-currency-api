import express from "express";
import { refreshCountry, getCountries, getImage, getCountry, deleteCountry} from "../controllers/countriesControllers.js";

const countriesRouter = express.Router();

countriesRouter.post('/refresh', refreshCountry);
countriesRouter.get('/', getCountries);
countriesRouter.get('/image', getImage);
countriesRouter.get('/:name', getCountry);
countriesRouter.delete('/:name', deleteCountry);

export default countriesRouter;
