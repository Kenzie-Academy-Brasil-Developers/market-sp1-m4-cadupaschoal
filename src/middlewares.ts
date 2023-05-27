import { Response, Request, NextFunction } from 'express';
import { market } from './database';
import { IProduct, TVerifyUpadateBody } from './interfaces';

export const verifyIfNameExist = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const requestList = req.body;
  const addList: IProduct[] = [];
  if (market.length === 0) {
    res.locals = {
      ...res.locals,
      newProducts: requestList,
    };
    return next();
  }
  const marketNames = market.map((marketItem) => marketItem.name);
  const verifyName = requestList.map((product: IProduct) => {
    if (!product.name) {
      const message = 'Product don`t hava a name';
      return res.status(400).json({ message });
    }
    const compareNames = marketNames.includes(product.name);

    if (!compareNames) {
      addList.push(product);
    }
    if (addList.length !== 0) {
      res.locals = {
        ...res.locals,
        newProducts: addList,
      };
    } else {
      const error = 'Product already registered';
      return res.status(409).json({ error });
    }
  });
  return next();
};

export const updateVerifyIfNameExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const { name } = request.body;

  const marketNames = market.map((product: IProduct) => product.name);

  if (marketNames.includes(name)) {
    const error = 'Product already registered';
    response.status(409).json({ error });
  }

  return next();
};

export const VerifyIfIdExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const reqId = request.params.id;
  const getIndex = market.findIndex(
    (product) => product.id === parseInt(reqId)
  );

  if (getIndex === -1) {
    const error = { error: 'Product not found' };
    return response.status(404).json(error);
  }

  response.locals = {
    ...response.locals,
    productIndex: getIndex,
  };

  return next();
};

export const updateVerifyIfIdeExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const reqId = request.params.id;
  const getProduct: IProduct | undefined = market.find(
    (product: IProduct): boolean => product.id === parseInt(reqId)
  );

  if (!getProduct) {
    const error = { error: 'Product not found' };
    return response.status(404).json(error);
  }

  response.locals = {
    ...response.locals,
    getProduct,
    productPosition: market.indexOf(getProduct),
  };

  return next();
};

export const verifyUpdateBody = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const payload: TVerifyUpadateBody | undefined = request.body;
  const { getProduct } = response.locals;
  if (payload?.id) {
    const newPayload = {
      ...payload,
      id: parseInt(request.params.id),
    };

    response.locals = {
      ...response.locals,
      formatedPayload: newPayload,
    };
  }

  if (payload?.expirationDate) {
    const { formatedPayload } = response.locals;
    const newPayload = {
      ...formatedPayload,
      expirationDate: getProduct.expirationDate,
    };
    response.locals = {
      ...response.locals,
      formatedPayload: newPayload,
    };
  }

  return next();
};
