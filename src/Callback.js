import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Callback({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: '1284116002485047428',
          client_secret: 'z4iN7167MO3I4QcUPmPLcODEx5DRn7fD',
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:3000/feurofcode/callback',
        }),
      })
        .then(response => response.json())
        .then(data => {
          const accessToken = data.access_token;
          const tokenType = data.token_type;

          if (accessToken) {
            localStorage.setItem('discord_token', accessToken);
            localStorage.setItem('token_type', tokenType);

            fetch('https://discord.com/api/users/@me', {
              headers: {
                authorization: `${tokenType} ${accessToken}`,
              },
            })
              .then(response => response.json())
              .then(data => {
                setUser({
                  name: data.username,
                  picture: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
                });
                navigate('/');
              })
              .catch(error => {
                console.error('Error fetching Discord user:', error);
                navigate('/');
              });
          } else {
            navigate('/');
          }
        })
        .catch(error => {
          console.error('Error exchanging code for token:', error);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate, location, setUser]);

  return <div>Logging in...</div>;
}

export default Callback;