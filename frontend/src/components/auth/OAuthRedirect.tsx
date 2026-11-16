import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
import axios from 'axios';
import { AUTH_URL } from '../../constants/api';
import IUser from '../../types/user.type';

interface OAuthRedirectProps {
  updateUserState: (user: IUser) => void;
}

const OAuthRedirect: React.FC<OAuthRedirectProps> = ({ updateUserState }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("====================================");
    console.log("🚀 OAuthRedirect MOUNTED");
    console.log("🌐 Current URL:", window.location.href);
    console.log("🌐 Current pathname:", window.location.pathname);
    console.log("🌐 Current hash:", window.location.hash);
    console.log("====================================");
    let listenerHandle: PluginListenerHandle | undefined;

    const processToken = (token: string) => {
      axios
        .get(AUTH_URL + 'me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          const data = res.data;

          const user: IUser = {
            id: data.id,
            username: data.username,
            email: data.email,
            roles: data.roles
          };

          localStorage.setItem(
            'user',
            JSON.stringify({
              ...user,
              accessToken: token
            })
          );

          updateUserState(user);

          const roles = user.roles ?? [];

          if (roles.includes('ROLE_USER')) {
            navigate('/training');
          } else if (roles.includes('ROLE_TRAINER')) {
            navigate('/programs');
          } else {
            navigate('/profile');
          }

        })
        .catch(err => {
          navigate('/login');
        });
    };

    const handleOAuthUrl = (url: string) => {
      try {
        const parsedUrl = new URL(url);
        const token = parsedUrl.searchParams.get('token');


        if (token) {
          processToken(token);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    const initialize = async () => {
      // Android / Capacitor

      listenerHandle = await App.addListener(
        'appUrlOpen',
        (event: URLOpenListenerEvent) => {

          console.log("====================================");
          console.log("🎯 appUrlOpen EVENT RECEIVED");
          console.log("🎯 URL:", event.url);
          console.log("====================================");

          handleOAuthUrl(event.url);
        }
      );


      const launchUrl = await App.getLaunchUrl();


      if (launchUrl?.url) {
        handleOAuthUrl(launchUrl.url);
      } else {
      }

      // WWW / HashRouter
      const hash = window.location.hash;

      const queryIndex = hash.indexOf('?');

      if (queryIndex !== -1) {
        const queryString = hash.substring(queryIndex + 1);
        const params = new URLSearchParams(queryString);
        const token = params.get('token');

        if (token) {
          console.log("🌐 Web OAuth token:", token);
          processToken(token);
        }
      }
    };

    initialize();

    return () => {
      listenerHandle?.remove();
    };
  }, [navigate, updateUserState]);

  return <div>Signing you in...</div>;
};

export default OAuthRedirect;