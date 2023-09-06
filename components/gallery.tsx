"use client";

import '@/static/gallery.css'

type GalleryProps = {
    page: string;
};

export default function Gallery(props : GalleryProps){
    return (
        <div className="gallery grow w-full flex flex-1 justify-center align-center">
            <div className='galleryItem justify-center align-center'><img src="img_girl.jpg" alt="Girl in a jacket"/></div>
            <div className='galleryItem justify-center align-center'><img src="img_girl.jpg" alt="Girl in a jacket"/></div>
            <div className='galleryItem justify-center align-center'><img src="img_girl.jpg" alt="Girl in a jacket"/></div>
            <div className='galleryItem justify-center align-center'><img src="img_girl.jpg" alt="Girl in a jacket"/></div>
        </div>
    );
}