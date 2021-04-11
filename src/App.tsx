import React, { useCallback, useRef, useState } from 'react'
// import './styles.css'
import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'
import { parse } from 'spotify-uri'
import { apiService } from './api'
import PosterContent from './components/poster-content'

export default function App() {
  const domRef = useRef(null)
  const baseUrl = 'https://scannables.scdn.co/uri/800/'

  const [urlInputValue, setUrlInputValue] = useState('')
  const [titleInputValue, setTitleInputValue] = useState('')
  const [subtitleInputValue, setSubtitleInputValue] = useState('')
  const [imageInputValue, setImageInputValue] = useState('')

  const [urlImage, setUrlImage] = useState('https://scannables.scdn.co/uri/800/spotify:playlist:37i9dQZF1DX1pl2bOU4cVI')
  const [title, setTitle] = useState('Title')
  const [subtitle, setSubtitle] = useState('Subtitle')
  const [customImage, setCustomImage] = useState('')

  const getUrlImage = useCallback((uri: string) => {
    return `${baseUrl}${uri}`
  }, [])

  const handleClickGenerate = useCallback(async () => {
    if (!urlInputValue) return

    const parsed = parse(urlInputValue)

    setUrlImage(getUrlImage(parsed.toURI()))

    const { data } = await apiService.getDetails(urlInputValue)

    const details = getDetailsData(data)

    setCustomImage(imageInputValue)

    setTitle(titleInputValue ? titleInputValue : details.title)

    setSubtitle(subtitleInputValue ? subtitleInputValue : details.subtitle)
  }, [urlInputValue, titleInputValue, subtitleInputValue, imageInputValue])

  const handleClickDownload = useCallback(() => {
    domtoimage.toBlob(domRef.current!).then(function (blob) {
      saveAs(blob, `${subtitle} - ${title}.png`)
    })
  }, [domRef, title, subtitle])

  return (
    <div className="App">
      <div>
        <label>Spotify Link: </label>
        <input
          type="text"
          onChange={(event) => {
            setUrlInputValue(event.currentTarget.value)
          }}
        />
      </div>
      <br />

      <div>
        <label>Título (opcional): </label>
        <input
          type="text"
          onChange={(event) => {
            setTitleInputValue(event.currentTarget.value)
          }}
        />
      </div>
      <br />

      <div>
        <label>Subtítulo (opcional): </label>
        <input
          type="text"
          onChange={(event) => {
            setSubtitleInputValue(event.currentTarget.value)
          }}
        />
      </div>
      <br />
      <div>
        <label>Imagem Customizada (opcional): </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/png, image/jpeg"
          onChange={async (event) => {
            const files = event.target.files

            if (files && files.length) {
              const base64 = await toBase64(files[0])
              if (base64) {
                setImageInputValue(`${base64}`)
              }
            } else {
              setImageInputValue('')
            }
          }}
        />
      </div>
      <br />

      <div>
        <button onClick={() => handleClickGenerate()}>Generate</button>
        <button onClick={() => handleClickDownload()}>Download</button>
      </div>

      <br />
      <PosterContent ref={domRef} urlImage={urlImage} customImage={customImage} title={title} subtitle={subtitle} />
    </div>
  )
}

const toBase64 = (file: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

interface DetailData {
  type: string
  images: [{ url: string }]
  name: string
  artists: [{ name: string }]
  owner: { display_name: string }
  album: { name: string; images: [{ url: string }] }
  display_name: string
  id: number
}

const getDetailsData = (data: DetailData) => {
  const se = { imageUrl: '', title: '', subtitle: '' }

  switch (data.type) {
    case 'album':
      se.imageUrl = data.images[0].url
      se.title = data.name
      se.subtitle = data.artists[0].name
      break
    case 'playlist':
      se.imageUrl = data.images[0].url
      se.title = data.name
      se.subtitle = data.owner.display_name
      break
    case 'track':
      se.imageUrl = data.album.images[0].url
      se.title = data.name
      se.subtitle = data.artists.map((artist) => artist.name).join(', ')
      break
    case 'artist':
      se.imageUrl = data.images[0].url
      se.title = data.name
      se.subtitle = ''
      break
    case 'user':
      se.imageUrl = data.images[0] ? data.images[0].url : 'images/create/user-blank.svg'
      se.title = data.display_name || `${data.id}`
  }

  return se
}
