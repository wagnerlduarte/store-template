import React, { forwardRef } from 'react'

import { Textfit } from 'react-textfit'
import Thumbnail from './thumbnail'

interface Props {
  urlImage: string
  customImage: string
  title: string
  subtitle: string
}

const PosterContent = forwardRef<HTMLDivElement, Props>(({ urlImage, customImage, title, subtitle }: Props, ref) => {
  return (
    <div ref={ref} style={{ height: 1754, width: 1240, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#17181A' }}>
      <Thumbnail urlImage={urlImage} customImage={customImage} />

      <div style={{ width: '100%', paddingTop: 80 }}>
        <Textfit style={{ color: 'white', textAlign: 'center', fontWeight: '900' }} max={97} mode="single">
          {title}
        </Textfit>
      </div>

      <span style={{ color: '#bebebe', paddingTop: 50, paddingBottom: 90, fontSize: 75 }}>{subtitle}</span>
    </div>
  )
})

PosterContent.displayName = 'PosterContent'

export default PosterContent
