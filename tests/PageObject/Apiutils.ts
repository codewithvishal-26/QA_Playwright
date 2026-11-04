import { APIRequestContext, expect } from '@playwright/test';

export interface LoginPayload {
  userEmail: string;
  userPassword: string;
}

export interface OrderPayload {
  orders: { country: string; productOrderedId: string }[];
}

export interface OrderResult {
  token: string;
  orderId: string;
}

export class ApiUtils {
  readonly apiContext: APIRequestContext;
  readonly loginPayLoad: LoginPayload;

  constructor(apiContext: APIRequestContext, loginPayLoad: LoginPayload) {
    this.apiContext = apiContext;
    this.loginPayLoad = loginPayLoad;
  }

  async getToken(): Promise<string> {
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      { data: this.loginPayLoad }
    );
    const loginResponseJson = await loginResponse.json();
    const token: string = loginResponseJson.token;
    console.log(token);
    return token;
  }

  async createOrder(orderPayLoad: OrderPayload): Promise<OrderResult> {
    const token = await this.getToken();

    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayLoad,
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);

    expect(
      orderResponse.ok(),
      `Order creation failed: ${JSON.stringify(orderResponseJson)}`
    ).toBeTruthy();

    const orderId: string = orderResponseJson.orders[0];
    return { token, orderId };
  }
}