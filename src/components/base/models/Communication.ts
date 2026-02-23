
import { IApi, IProductListResponse,  IOrderResult, IProduct, IOrder } from '../../../types'; 

export class Communication {

  protected api: IApi;

  constructor(api: IApi) {
  this.api = api;
  }


 async getProducts(): Promise<IProduct[]> {
            return this.api.get<IProductListResponse>('/product').then((data) =>
            data.items.map((item) => ({
                ...item

            }))
        );
  }

    // Отправка заказа
  async postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order', order);
  }
}


//  getProducts: Promise<IProduct[]> 
//  postOrder(order: IOrder): Promise<IOrderResult> 