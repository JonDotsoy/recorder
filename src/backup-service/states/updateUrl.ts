import { successPing } from "./success-ping";
import { serviceURLWritter } from "./service-url-writter";

export const updateUrl = (newUrl: string | null) => {
  successPing.set(false);
  if (newUrl === null || newUrl === "") {
    serviceURLWritter.set(null);
    return;
  }
  serviceURLWritter.set(newUrl);
};
