import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { App, URLOpenListenerEvent } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import axios from "axios";

import { AUTH_URL } from "../constants/api";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";

interface UseOAuthListenerProps {
  updateUserState: (user: IUser) => void;
}

const useOAuthListener = ({
  updateUserState,
}: UseOAuthListenerProps) => {
  const navigate = useNavigate();

  // Chroni przed dwukrotnym przetworzeniem tego samego callbacka
  const processedUrl = useRef<string | null>(null);

  useEffect(() => {
    let listenerHandle: PluginListenerHandle | undefined;

    const processToken = async (token: string) => {
      try {
        const response = await axios.get(AUTH_URL + "me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        const user: IUser = {
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles,
        };

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            accessToken: token,
          })
        );

        console.log("💾 OAuth user saved");

        updateUserState(user);

        const roles = user.roles ?? [];

        if (roles.includes("ROLE_USER")) {
          navigate("/training");
        } else if (roles.includes("ROLE_TRAINER")) {
          navigate("/programs");
        } else {
          navigate("/profile");
        }

      } catch (error: any) {
        AuthService.logout();
        navigate("/login");
      }
    };

    const handleOAuthUrl = (url: string) => {
      // Nie przetwarzamy tego samego callbacka drugi raz
      if (processedUrl.current === url) {
        return;
      }

      processedUrl.current = url;

      try {
        const parsedUrl = new URL(url);

        const token = parsedUrl.searchParams.get("token");

        if (!token) {
          navigate("/login");
          return;
        }

        processToken(token);

      } catch (error) {
        navigate("/login");
      }
    };

    const initialize = async () => {

      /*
       * ANDROID / CAPACITOR
       */
      listenerHandle = await App.addListener(
        "appUrlOpen",
        (event: URLOpenListenerEvent) => {

          handleOAuthUrl(event.url);
        }
      );

      /*
       * APP URUCHOMIONA BEZPOŚREDNIO Z DEEP LINKU
       */
      const launchUrl = await App.getLaunchUrl();
      if (launchUrl?.url) {
        handleOAuthUrl(launchUrl.url);
      }

      /*
       * WEB / HASH ROUTER
       */
      const hash = window.location.hash;

      const queryIndex = hash.indexOf("?");

      if (queryIndex !== -1) {
        const queryString = hash.substring(queryIndex + 1);

        const params = new URLSearchParams(queryString);

        const token = params.get("token");

        if (token) {
          processToken(token);
        }
      }
    };

    initialize();

    return () => {
      listenerHandle?.remove();
    };
  }, [navigate, updateUserState]);
};

export default useOAuthListener;