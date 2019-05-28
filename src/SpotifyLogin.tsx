import React, { Component } from 'react';

import { IonButton } from '@ionic/react';

interface SpotifyLoginProps {
  target: string;
  params: {
    [index: string]: string;
    response_type: string;
    state: string;
    scope: string;
    show_dialog: string;
  };
}

class SpotifyLogin extends Component<SpotifyLoginProps, {}> {
  render() {
    const link = `${this.props.target}?${Object.keys(this.props.params)
      .map(key => {
        return `${key}=${this.props.params[key]}`;
      })
      .join('&')}`;

    return <IonButton href={link}>Login with Spotify</IonButton>;
  }
}

export default SpotifyLogin;
