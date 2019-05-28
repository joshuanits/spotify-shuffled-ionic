import React, { Component } from 'react';
import {
  IonCardHeader,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonLabel
} from '@ionic/react';

interface PlaylistInfoProps {
  id: string;
  name: string;
  numTracks: number;
  shuffling: boolean;
  shuffled: number;
}

class PlaylistInfo extends Component<PlaylistInfoProps, {}> {
  render() {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{this.props.name}</IonCardTitle>
          <IonCardContent>
            <IonLabel>
              {this.props.shuffling
                ? `Shuffling: ${this.props.shuffled}/${this.props.numTracks}`
                : `Number of songs: ${this.props.numTracks}`}
            </IonLabel>
            {this.props.children}
          </IonCardContent>
        </IonCardHeader>
      </IonCard>
    );
  }
}

export default PlaylistInfo;
