import React, { Component } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonButton
} from '@ionic/react';

import { History } from 'history';

class ErrorCard extends Component<{ history: History }> {
  render() {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Error</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonLabel>Something went wrong, try starting again</IonLabel>
          <br />
          <IonButton
            onClick={() => {
              this.props.history.push('/');
            }}>
            Go back
          </IonButton>
        </IonCardContent>
      </IonCard>
    );
  }
}

export default ErrorCard;
