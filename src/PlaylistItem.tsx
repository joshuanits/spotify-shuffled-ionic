import React, { Component } from 'react';

import { IonItem } from '@ionic/react';

export interface PlaylistItemProps {
  id: string;
  name: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
  onPlaylistClick(id: string): void;
}

export class PlaylistItem extends Component<PlaylistItemProps, {}> {
  render() {
    return (
      <IonItem
        key={this.props.id}
        button={true}
        onClick={() => {
          this.props.onPlaylistClick(this.props.id);
        }}>
        {this.props.name}
      </IonItem>
    );
  }
}
