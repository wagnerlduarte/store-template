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
  const [barCodeBackgroundColorInputValue, setBarCodeBackgroundColorInputValue] = useState('')
  const [barCodeColorInputValue, setBarCodeColorInputValue] = useState<'black' | 'white' | undefined>(undefined)

  const [urlImage, setUrlImage] = useState('https://scannables.scdn.co/uri/800/spotify:playlist:37i9dQZF1DX1pl2bOU4cVI')
  const [title, setTitle] = useState('Title')
  const [subtitle, setSubtitle] = useState('Subtitle')
  const [customImage, setCustomImage] = useState('')
  const customImageInputRef = React.useRef<HTMLInputElement>(null)

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

  const clearForm = useCallback(() => {
    setUrlInputValue('')
    setTitleInputValue('')
    setSubtitleInputValue('')
    setImageInputValue('')
    setBarCodeBackgroundColorInputValue('')
    setBarCodeColorInputValue(undefined)
    setCustomImage('')
    if (customImageInputRef.current) {
      customImageInputRef.current.value = ''
    }
  }, [])

  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
          <fieldset>
            <legend>Conte??do padr??o</legend>
            <div>
              <label>Spotify Link: </label>
              <input
                type="text"
                value={urlInputValue}
                onChange={(event) => {
                  setUrlInputValue(event.currentTarget.value)
                }}
              />
            </div>
            <br />

            <div>
              <label>T??tulo (opcional): </label>
              <input
                type="text"
                value={titleInputValue}
                onChange={(event) => {
                  setTitleInputValue(event.currentTarget.value)
                }}
              />
            </div>
            <br />

            <div>
              <label>Subt??tulo (opcional): </label>
              <input
                type="text"
                value={subtitleInputValue}
                onChange={(event) => {
                  setSubtitleInputValue(event.currentTarget.value)
                }}
              />
            </div>
            <br />
          </fieldset>

          <fieldset>
            <legend>Conte??do customizado</legend>
            <div>
              <label>Imagem Customizada (opcional): </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                ref={customImageInputRef}
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
              <label>Bar Code Background Color (opcional): </label>
              <input
                type="text"
                value={barCodeBackgroundColorInputValue}
                onChange={(event) => {
                  setBarCodeBackgroundColorInputValue(event.currentTarget.value)
                }}
              />
            </div>
            <br />
            <div>
              <label>Bar Code Color (opcional): </label>
              <select
                value={barCodeColorInputValue ? barCodeColorInputValue : ''}
                onChange={(event) => {
                  let color

                  switch (event.currentTarget.value) {
                    case 'white':
                      color = event.currentTarget.value
                      break
                    case 'black':
                      color = event.currentTarget.value
                      break
                    default:
                      color = undefined
                      break
                  }

                  setBarCodeColorInputValue(color)
                }}
              >
                <option>-</option>
                <option value="white">Branco</option>
                <option value="black">Preto</option>
              </select>
            </div>
          </fieldset>

          <br />

          <div>
            <button onClick={() => handleClickGenerate()}>Generate</button>
            <button onClick={() => handleClickDownload()}>Download</button>
            <button onClick={() => clearForm()}>Clear</button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 2 }}>
          <PosterContent
            ref={domRef}
            urlImage={urlImage}
            customImage={customImage}
            title={title}
            subtitle={subtitle}
            barCodeBackgroundColor={barCodeBackgroundColorInputValue}
            barCodeColor={barCodeColorInputValue}
          />
        </div>
      </div>
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
