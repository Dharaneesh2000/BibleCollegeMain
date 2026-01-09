import Lottie from 'lottie-react'
import bookAnimation from '../../../assets/assets/bookwithbookmark.json'

interface LoaderProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  fullScreen?: boolean
  textColor?: 'dark' | 'light'
}

const Loader = ({ size = 'medium', message, fullScreen = false, textColor = 'dark' }: LoaderProps) => {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  }

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-12'

  const textColorClass = textColor === 'light' ? 'text-white' : 'text-gray-600'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} mx-auto mb-4`}>
          <Lottie
            animationData={bookAnimation}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {message && (
          <p className={`${textColorClass} text-lg font-medium mt-4`}>{message}</p>
        )}
      </div>
    </div>
  )
}

export default Loader

