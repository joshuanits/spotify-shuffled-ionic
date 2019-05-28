import React, { Component } from 'react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import {
  IonApp,
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonPage,
  IonRouterOutlet,
  IonCardContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonLabel
} from '@ionic/react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import query from 'query-string';

import SpotifyLogin from './SpotifyLogin';
import PlaylistList from './PlaylistList';
import ErrorCard from './ErrorCard';
import PlaylistInfo from './PlaylistInfo';

import { AppState } from './reducers';
import { setToken } from './actions';

import { connect } from 'react-redux';

import { History } from 'history';

import { Deeplinks } from '@ionic-native/deeplinks';

class LoginPage extends Component {
  render() {
    return (
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Welcome to Ionic</IonCardSubtitle>
            <IonCardTitle>Spotify Shuffler</IonCardTitle>
            <IonCardContent>Get started by logging in:</IonCardContent>
            <SpotifyLogin
              target="http://128.199.206.151:81/spotify-swap/index.php"
              params={{
                response_type: 'code',
                state: '',
                scope:
                  'playlist-modify-private playlist-modify-public playlist-read-private',
                show_dialog: 'False'
              }}
            />
          </IonCardHeader>
        </IonCard>
      </IonContent>
    );
  }
}

class SpotifyRedirect extends Component<any, {}> {
  state = {
    loaded: false,
    failed: false
  };

  componentDidMount() {
    const code = query.parse(this.props.location.search).code;

    fetch('http://128.199.206.151:81/spotify-swap/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=authorization_code&code=${code}`
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.error) {
          this.setState({ failed: true });
        } else {
          this.props.setToken(data.access_token);
          this.setState({ loaded: true });
        }
      });
  }

  render() {
    return (
      <IonContent>
        <MyHeader history={this.props.history} />
        {this.state.loaded ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Successfully logged in with Spotify</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton
                onClick={() => {
                  this.props.history.push('/playlist');
                }}>
                Continue
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : !this.state.failed ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Loading...</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        ) : (
          <ErrorCard history={this.props.history} />
        )}
      </IonContent>
    );
  }
}

class PlaylistSelectPage extends Component<any, {}> {
  onPlaylistClick = (id: string) => {
    this.props.history.push(`/playlist/${id}`);
  };

  render() {
    const { token } = this.props;

    return (
      <IonContent>
        <MyHeader history={this.props.history} />
        {token ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Playlists</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <PlaylistList
                spotifyToken={token}
                onPlaylistClick={this.onPlaylistClick}
              />
            </IonCardContent>
          </IonCard>
        ) : (
          <ErrorCard history={this.props.history} />
        )}
      </IonContent>
    );
  }
}

class PlaylistPage extends Component<any, {}> {
  state = {
    failed: false,
    loaded: false,
    name: '',
    numTracks: -1,
    shuffling: false,
    shuffled: -1
  };

  componentDidMount() {
    if (!this.props.token) {
      this.setState({ failed: true });
      return;
    }
    fetch(
      `https://api.spotify.com/v1/playlists/${this.props.match.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${this.props.token}`
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.error) {
          this.setState({ failed: true });
        } else {
          this.setState({
            loaded: true,
            name: data.name,
            numTracks: data.tracks.total
          });
        }
      });
  }

  componentDidUpdate() {
    if (this.state.shuffling) {
      const tracksRemaining = this.state.numTracks - this.state.shuffled;
      const shuffleIndex = Math.floor(Math.random() * tracksRemaining);

      console.log(this.state.shuffled);

      fetch(
        `https://api.spotify.com/v1/playlists/${
          this.props.match.params.id
        }/tracks`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.props.token}`
          },
          body: JSON.stringify({
            range_start: this.state.shuffled + shuffleIndex,
            insert_before: 0
          })
        }
      )
        .then(response => {
          console.log('response');
          return response.json();
        })
        .then(data => {
          console.log(data);
          if (data.error) {
            throw Error();
          } else {
            this.setState({
              shuffling: this.state.shuffled + 1 < this.state.numTracks,
              shuffled: this.state.shuffled + 1
            });
          }
        });
    }
  }

  onButtonClick = () => {
    this.setState({ shuffling: true, shuffled: 0 });
  };

  render() {
    return (
      <IonContent>
        <MyHeader history={this.props.history} />
        {this.state.loaded ? (
          <PlaylistInfo
            id={this.props.match.params.id}
            name={this.state.name}
            numTracks={this.state.numTracks}
            shuffling={this.state.shuffling}
            shuffled={this.state.shuffled}>
            <br />
            <IonButton onClick={this.onButtonClick}>Shuffle</IonButton>
          </PlaylistInfo>
        ) : !this.state.failed ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Loading...</IonCardTitle>
              <IonCardContent>Fetching playlist information.</IonCardContent>
            </IonCardHeader>
          </IonCard>
        ) : (
          <ErrorCard history={this.props.history} />
        )}
      </IonContent>
    );
  }
}

class MyHeader extends Component<{
  history: History;
}> {
  render() {
    return (
      <IonHeader>
        <IonToolbar>
          <IonButtons
            slot="start"
            onClick={() => {
              const pathParts = this.props.history.location.pathname.split('/');
              pathParts.pop();
              this.props.history.push(pathParts.join('/'));
            }}>
            <IonButton>
              <IonIcon name="arrow-back" />{' '}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    );
  }
}

class App extends Component<AppProps, {}> {
  render() {
    const token = this.props.token;
    return (
      <Router>
        <div className="App">
          <IonApp>
            <IonPage id="main">
              <IonRouterOutlet>
                <Route
                  exact
                  path="/spotify-auth"
                  render={routeProps => {
                    return (
                      <SpotifyRedirect
                        {...routeProps}
                        setToken={this.props.setToken}
                      />
                    );
                  }}
                />
                <Route exact path="/" component={LoginPage} />
                <Route
                  exact
                  path="/playlist"
                  render={routeProps => {
                    return <PlaylistSelectPage {...routeProps} token={token} />;
                  }}
                />
                <Route
                  path="/playlist/:id"
                  render={routeProps => {
                    return <PlaylistPage {...routeProps} token={token} />;
                  }}
                />
              </IonRouterOutlet>
            </IonPage>
          </IonApp>
        </div>
      </Router>
    );
  }
}

interface AppProps {
  setToken: typeof setToken;
  token: string;
}

const mapStateToProps = (state: AppState) => {
  return {
    token: state.token
  };
};

export default connect(
  mapStateToProps,
  { setToken }
)(App);
