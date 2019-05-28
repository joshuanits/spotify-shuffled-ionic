import React, { Component } from 'react';
import { IonList } from '@ionic/react';

import { PlaylistItem, PlaylistItemProps } from './PlaylistItem';

interface PlaylistListProps {
  spotifyToken: string;
  onPlaylistClick(id: string): void;
}

interface PlaylistListState {
  playlists: Array<PlaylistItemProps>;
  userId: string;
}

class PlaylistList extends Component<PlaylistListProps, PlaylistListState> {
  constructor(props: any) {
    super(props);

    this.state = {
      playlists: [],
      userId: ''
    };
  }

  fetchPlaylists() {
    let { spotifyToken } = this.props;
    let { userId } = this.state;

    fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        Authorization: `Bearer ${spotifyToken}`
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const playlists = data.items as Array<any>;
        console.log(data);
        playlists.forEach(item => {
          if (item.owner.id === userId || item.collaborative) {
            this.setState({
              playlists: this.state.playlists.concat([
                {
                  id: item.id as string,
                  name: item.name as string,
                  onPlaylistClick: this.props.onPlaylistClick
                }
              ])
            });
          }
        });
      });
  }

  componentDidMount() {
    // fetch playlists from spotify api
    let { spotifyToken } = this.props;

    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${spotifyToken}`
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.error) throw Error();
        else {
          this.setState({
            userId: data.id
          });

          this.fetchPlaylists();
        }
      });

    return;
  }

  render() {
    return (
      <IonList>
        {this.state.playlists.map(playlist => {
          return <PlaylistItem {...playlist} key={playlist.id} />;
        })}
      </IonList>
    );
  }
}

export default PlaylistList;
