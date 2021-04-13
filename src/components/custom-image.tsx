import React, { useEffect, useState } from 'react'
import { PaletteColors, usePalette } from 'react-palette'

import { apiService } from '../api'

interface Props {
  customImage: string
  urlImage: string
  barCodeBackgroundColor?: string
  barCodeColor?: 'white' | 'black'
}

const CustomImage = ({ customImage, urlImage, barCodeBackgroundColor, barCodeColor }: Props) => {
  const { data: pallete, loading } = usePalette(customImage)

  const [customCode, setCustomCode] = useState('')

  useEffect(() => {
    if (!loading && Object.keys(pallete).length) {
      const uri = apiService.getUri(urlImage)

      const palleteProperty: keyof PaletteColors = 'lightVibrant'

      let backgroundBarColor

      if (barCodeBackgroundColor) {
        backgroundBarColor = barCodeBackgroundColor
      } else {
        backgroundBarColor = pallete[palleteProperty] ?? '000000'
      }

      let barColor

      if (barCodeColor) {
        barColor = barCodeColor
      } else {
        const palleteColor = pallete[palleteProperty]
        barColor = palleteColor ? getBarColor(palleteColor) : 'white'
      }

      setCustomCode(`https://scannables.scdn.co/uri/plain/jpeg/${backgroundBarColor.replace('#', '')}/${barColor}/640/${uri.uriLink}`)
    }
  }, [pallete, loading, urlImage, barCodeBackgroundColor, barCodeColor])

  return (
    <>
      <div
        style={{
          marginTop: 65,
          background: 'no-repeat center',
          backgroundSize: 'cover',
          backgroundImage: `url('${customImage}')`,
          height: '64%',
          width: '81%',
        }}
      ></div>
      <div
        style={{
          background: 'no-repeat center',
          backgroundSize: 'cover',
          backgroundImage: `url('${customCode}')`,
          height: '16%',
          width: '81%',
        }}
      ></div>
    </>
  )
}

function getBarColor(hex: string) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }

  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }

  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16)

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'black' : 'white'
}

CustomImage.displayName = 'CustomImage'

export default CustomImage
