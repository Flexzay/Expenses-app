import { request } from "./request";

type AmountPayload = {
  monthly_amount: number;
};

export async function updateAmountService(payload: AmountPayload) {
  return request("put", "/profile/amount", payload);
}