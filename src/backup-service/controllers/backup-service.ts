import { serviceURL as urlState } from "../states/service-url.js";

export const ping = async () => {
  const url = urlState.get();
  if (!url) return false;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) return true;
    return false;
  } catch (error) {
    return false;
  }
};
