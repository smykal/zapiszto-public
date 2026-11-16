import axios from "axios";
import AuthService from "../services/auth.service";
import EventBus from "./EventBus";

// Dodaj interceptor do odpowiedzi
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Sprawdź czy odpowiedź ma status 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      AuthService.logout();
      EventBus.dispatch("logout");

      // Przekierowanie na stronę główną
      //window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
