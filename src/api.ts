import axios from 'axios'

class ApiService {
  private authToken() {
    const configs = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

    const { REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } = process.env

    if (!REACT_APP_CLIENT_ID || !REACT_APP_CLIENT_SECRET) {
      throw 'Deve informar uma chave REACT_APP_CLIENT_ID e REACT_APP_CLIENT_SECRET no .env para autenticar'
    }

    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('client_id', REACT_APP_CLIENT_ID)
    params.append('client_secret', REACT_APP_CLIENT_SECRET)

    return axios.create().post('https://accounts.spotify.com/api/token', params, configs)
  }

  getUri(uri: string) {
    const t = uri.indexOf('track'),
      n = uri.indexOf('artist'),
      r = uri.indexOf('album'),
      o = uri.indexOf('playlist'),
      i = uri.indexOf('user'),
      a = uri.indexOf('genre'),
      s = uri.indexOf('show'),
      u = uri.indexOf('episode'),
      l = 'https://api.spotify.com/v1',
      c = { apiLink: '', uriLink: '', type: '' }
    if (t >= 0) {
      const f = uri.substr(t + 6, 22)
      c.apiLink = l + '/tracks/' + f
      c.uriLink = 'spotify:track:' + f
      c.type = 'track'
    } else if (n >= 0) {
      const p = uri.substr(n + 7, 22)
      c.apiLink = l + '/artists/' + p
      c.uriLink = 'spotify:artist:' + p
      c.type = 'artist'
    } else if (r >= 0) {
      const d = uri.substr(r + 6, 22)
      c.apiLink = l + '/albums/' + d
      c.uriLink = 'spotify:album:' + d
      c.type = 'album'
    } else if (o >= 0 && i >= 0) {
      const h = uri.substring(i + 5, o - 1),
        v = uri.substr(o + 9, 22)
      c.apiLink = l + '/users/' + h + '/playlists/' + v
      c.uriLink = 'spotify:user:' + h + ':playlist:' + v
      c.type = 'playlist'
    } else if (o >= 0) {
      const v = uri.substr(o + 9, 22)
      c.apiLink = l + '/playlists/' + v
      c.uriLink = 'spotify:playlist:' + v
      c.type = 'playlist'
    } else if (-1 == o && i >= 0) {
      const m = uri.split(':'),
        h = m.pop()
      c.apiLink = l + '/users/' + h
      c.uriLink = 'spotify:user:' + h
      c.type = 'user'
    } else if (a >= 0) {
      const g = uri.substr(a + 6, uri.length)
      c.apiLink = l + '/genre/' + g
      c.uriLink = 'spotify:genre:' + g
      c.type = 'genre'
    } else if (s >= 0) {
      const y = uri.substr(s + 5, uri.length)
      c.apiLink = l + '/show/' + y
      c.uriLink = 'spotify:show:' + y
      c.type = 'show'
    } else if (u >= 0) {
      const b = uri.substr(u + 8, uri.length)
      c.apiLink = l + '/episode/' + b
      c.uriLink = 'spotify:episode:' + b
      c.type = 'episode'
    } else {
      c.apiLink = uri
      c.uriLink = uri
      c.type = 'none'
    }
    return c
  }

  getDetails(uri: string) {
    return this.authToken().then((response) => {
      const { token_type, access_token } = response.data

      return axios.create({ headers: { authorization: `${token_type} ${access_token}` } }).get(this.getUri(uri).apiLink)
    })
  }
}

export const apiService = new ApiService()
