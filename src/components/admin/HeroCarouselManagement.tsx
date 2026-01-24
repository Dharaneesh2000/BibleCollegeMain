import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Loader from '../common/Loader'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

interface HeroSlide {
    id: string
    title: string
    image_url: string
    order_index: number
    is_active: boolean
}

const HeroCarouselManagement = () => {
    const [slides, setSlides] = useState<HeroSlide[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    useEffect(() => {
        fetchSlides()
    }, [])

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    const fetchSlides = async () => {
        try {
            const { data, error } = await supabase
                .from('hero_carousel')
                .select('*')
                .order('order_index', { ascending: true })
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setSlides(data)
        } catch (error) {
            console.error('Error fetching slides:', error)
            showNotification('error', 'Failed to fetch slides')
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            setUploading(true)
            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            // Upload image
            const { error: uploadError } = await supabase.storage
                .from('carousel-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('carousel-images')
                .getPublicUrl(filePath)

            // Create database record
            const { error: dbError } = await supabase
                .from('hero_carousel')
                .insert([
                    {
                        image_url: publicUrl,
                        title: file.name.split('.')[0],
                        is_active: true
                    }
                ])

            if (dbError) throw dbError

            showNotification('success', 'Image uploaded successfully')
            fetchSlides()
        } catch (error) {
            console.error('Error uploading image:', error)
            showNotification('error', 'Failed to upload image')
        } finally {
            setUploading(false)
            // Reset input
            event.target.value = ''
        }
    }

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!window.confirm('Are you sure you want to delete this slide?')) return

        try {
            // Delete from database
            const { error: dbError } = await supabase
                .from('hero_carousel')
                .delete()
                .eq('id', id)

            if (dbError) throw dbError

            // Try to delete from storage (optional, might fail if used elsewhere)
            try {
                const path = imageUrl.split('/').pop()
                if (path) {
                    await supabase.storage
                        .from('carousel-images')
                        .remove([path])
                }
            } catch (e) {
                console.warn('Could not delete file from storage', e)
            }

            showNotification('success', 'Slide deleted successfully')
            fetchSlides()
        } catch (error) {
            console.error('Error deleting slide:', error)
            showNotification('error', 'Failed to delete slide')
        }
    }

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
    }

    if (loading) return <Loader />

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#15133D]">Hero Carousel</h2>
                    <p className="text-gray-600">Manage images shown in the home page hero slider</p>
                </div>

                <div>
                    <label className={`flex items-center gap-2 px-4 py-2 bg-[#15133D] text-white rounded-lg cursor-pointer hover:bg-[#1a1650] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {uploading ? (
                            <Loader size="small" />
                        ) : (
                            <CloudUploadIcon />
                        )}
                        <span>{uploading ? 'Uploading...' : 'Upload New Image'}</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {notification && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {notification.type === 'success' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
                    {notification.message}
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide) => (
                    <div key={slide.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                        <div className="aspect-video relative">
                            <img
                                src={slide.image_url}
                                alt={slide.title || 'Slide'}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleDelete(slide.id, slide.image_url)}
                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    title="Delete Slide"
                                >
                                    <DeleteOutlineIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {slides.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500">No images found. Upload one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeroCarouselManagement
