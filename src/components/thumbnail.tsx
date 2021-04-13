import React from 'react'

import CustomImage from './custom-image'

interface Props {
  urlImage: string
  customImage: string
  barCodeBackgroundColor?: string
  barCodeColor?: 'white' | 'black'
}

const Thumbnail = ({ urlImage, customImage, barCodeBackgroundColor, barCodeColor }: Props) => {
  const renderDefaultImage = () => (
    <div
      style={{
        backgroundImage: `url('${urlImage}')`,
        backgroundRepeat: 'round',
        height: '80%',
        width: '81%',
        marginTop: 65,
      }}
    ></div>
  )

  return customImage ? (
    <CustomImage urlImage={urlImage} customImage={customImage} barCodeBackgroundColor={barCodeBackgroundColor} barCodeColor={barCodeColor} />
  ) : (
    renderDefaultImage()
  )
}

Thumbnail.displayName = 'Thumbnail'

export default Thumbnail
