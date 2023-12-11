import React, { useState } from "react";
import "./Gallery.css";
import PhotoEdit from "./PhotoEdit";

interface Photo {
  url: string;
  title: string;
  user_id: string;
  _id: string
  profile: boolean
}

interface GalleryProps {
  photos: Photo[];
  DeletePhoto: Function
}

const Gallery: React.FC<GalleryProps> = ({ photos, DeletePhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  return (
    <>
    <div className="gallery">
      {!selectedPhoto && photos.filter(photo => !photo.profile).map((photo: Photo, index: number) => (
        <div key={index} className="gallery-item" onClick={() => setSelectedPhoto(photo)}>
          <img src={photo.url} alt={photo.title} />
          <div className="gallery-item-title">{photo.title}</div>
        </div>
      ))}
      {
        selectedPhoto &&
        <div style={{ 
          maxWidth: '100%', 
          margin: 'auto', 
          overflowX: 'hidden' 
        }} ><PhotoEdit photo={selectedPhoto} DeletePhoto={DeletePhoto} setSelectedPhoto={setSelectedPhoto} /><button onClick={() => {setSelectedPhoto(null)}}>Zapisz</button></div>
      }
    </div>
    </>
  );
};

export default Gallery;