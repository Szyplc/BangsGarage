import React, { useEffect, useState, useContext } from "react";
import { storage } from "../../../base";
import axios from "axios";

interface Photo {
  url: string;
  title: string;
  user_id: string;
  _id: string;
  profile: boolean;
}

interface PhotoEditProps {
  photo: Photo;
  DeletePhoto: Function;
  setSelectedPhoto: React.Dispatch<React.SetStateAction<Photo | null>>;
}

const PhotoEdit: React.FC<PhotoEditProps> = ({
  photo,
  DeletePhoto,
  setSelectedPhoto,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [editedTitle, setEditedTitle] = useState(photo.title);
  const [newImageUrl, setNewImageUrl] = useState(photo.url);

  useEffect(() => {
    setEditedTitle(photo.title);
    setNewImageUrl(photo.url);
  }, [photo]);

  const handleEditClick = async () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    photo.title = editedTitle;
    update_photo();
  };

  const handleImageClick = () => {
    setIsChangingPhoto(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newUrl = URL.createObjectURL(e.target.files[0]);
      const file = e.target.files[0];
      setNewImageUrl(newUrl);
      setIsChangingPhoto(false);
      setIsEditing(false);
      let fullUrl = "";
      const storageRef = storage.ref();
      let name =
        user?.uid +
        "/gallery/" +
        file.name;
      const fileRef = storageRef.child(name);
      await fileRef.put(file).then(async () => {
        await fileRef.getDownloadURL().then((url) => {
          fullUrl = url;
        });
      });
      photo.url = fullUrl;
      update_photo();
    }
  };

  const update_photo = () => {
    // fetch("http://145.239.93.11:3000/edit_photo_in_gallery", {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "authorization": JSON.stringify(user),
    //       },
    //       body: JSON.stringify(photo)
    //     })
    //       .then((response) => response.json())
    axios
      .put("http://145.239.93.11:3000/edit_photo_in_gallery", photo, {
        headers: {
          "Content-Type": "application/json",
          authorization: JSON.stringify(user),
        },
      })
      .then((response) => {
        // Przetwarzanie odpowiedzi
        const data = response.data;
        // Możesz tu dodać kod do przetwarzania danych z odpowiedzi
      })
      .catch((error) => {
        // Obsługa błędów
        console.error("Wystąpił błąd:", error);
      });
  };

  /*function DeletePhoto() {
    
  }*/

  return (
    <div>
      <img
        style={{ maxWidth: "100%" }}
        src={newImageUrl}
        alt={photo.title}
        onClick={handleImageClick}
      />
      {isChangingPhoto && <input type="file" onChange={handleImageChange} />}
      {isEditing ? (
        <div>
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button onClick={handleSaveClick}>Zapisz</button>
        </div>
      ) : (
        <div onClick={handleEditClick}>{photo.title}</div>
      )}
      <button
        style={{ margin: 5 }}
        onClick={() => {
          DeletePhoto(photo);
          setSelectedPhoto(null);
        }}
      >
        Usuń
      </button>
    </div>
  );
};

export default PhotoEdit;
