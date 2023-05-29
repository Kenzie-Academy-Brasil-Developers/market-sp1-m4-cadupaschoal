import { Response, Request } from 'express';
import { market } from './database';
import { ICleaningProduct, IFoodProduct, TProductUpdate } from './interfaces';

export const generateId = (): number => {
  const lastProduct = market.sort((a, b): number => a.id - b.id).at(-1);
  if (!lastProduct) {
    return 1;
  }
  return lastProduct.id + 1;
};

export const generateExpirationDate = (date: Date) => {
  date.setFullYear(date.getFullYear() + 1);
  return date;
};

export const totalValues = (): number => {
  const marketValues = market.map((marketItem) => marketItem.price);
  const total = marketValues.reduce(
    (previousValue: number, accumulator: number) => {
      return accumulator + previousValue;
    },
    0
  );
  return total;
};

export const create = (request: Request, response: Response): Response => {
  const { newProducts } = response.locals;
  const date = new Date();
  const formatedResponse = newProducts.map(
    (product: IFoodProduct | ICleaningProduct) => {
      const newProduct = {
        ...product,
        id: generateId(),
        expirationDate: generateExpirationDate(new Date()),
      };
      market.push(newProduct);

      return newProduct;
    }
  );

  const serverResponse = {
    total: totalValues(),
    marketProducts: formatedResponse,
  };

  response.locals = {
    ...response.locals,
    totalPrice: totalValues(),
  };
  return response.status(201).json(serverResponse);
};

export const retrieve = (req: Request, res: Response): Response => {
  return res.status(200).json({ total: totalValues(), marketProducts: market });
};

export const retireveById = (
  request: Request,
  response: Response
): Response => {
  const { productIndex } = response.locals;

  return response.status(200).json(market[productIndex]);
};

export const update = (request: Request, response: Response): Response => {
  const { getProduct, productPosition, formatedPayload } = response.locals;
  const payload = request.body;
  if (formatedPayload) {
    const updatedProduct: TProductUpdate = (market[productPosition] = {
      ...getProduct,
      ...formatedPayload,
    });
    return response.status(200).json(updatedProduct);
  }

  const updatedProduct: TProductUpdate = (market[productPosition] = {
    ...getProduct,
    ...payload,
  });

  return response.status(200).json(updatedProduct);
};

export const erase = (request: Request, response: Response): Response => {
  const { productIndex } = response.locals;
  market.splice(productIndex, 1);
  return response.status(204).json();
};
