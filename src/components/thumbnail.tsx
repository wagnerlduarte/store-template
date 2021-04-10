import React from 'react'

import CustomImage from './custom-image'

interface Props {
  urlImage: string
  customImage: string
}

const Thumbnail = ({ urlImage, customImage }: Props) => {
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

  return customImage ? <CustomImage urlImage={urlImage} customImage={customImage} /> : renderDefaultImage()
}

Thumbnail.displayName = 'Thumbnail'

export default Thumbnail
