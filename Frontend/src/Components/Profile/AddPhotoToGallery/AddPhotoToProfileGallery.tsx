import { useState, useContext } from 'react'
import "./AddPhotoToProfileGallery.css"
import { storage } from "../../../base";
import { AuthContext } from '../../Auth/AuthContext';
import axios from 'axios';

const AddPhotoToProfileGallery = ({ getPhotos }: any) => {
    const [addingMenu, setAddingMenu] = useState<boolean>(false)
    const [titleValue, setTitleValue] = useState('')
    const [currentFile, setCurrentFile] = useState<Blob | null>(null)
    const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(AuthContext);

    const handleProfileImageChange = (e: any) => {
        const file = e.target.files[0];
        setCurrentFile(file)
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitleValue(event.target.value);
    }

    const sendPhoto = async () => {//jeżeli to klikniesz pobrać zdjęcia
        if(currentFile == null)
            return;
        //if(typeof currentFile != "object") {}
        let fullUrl = ""
        const storageRef = storage.ref();
        let name = user?.uid + "/gallery/" + currentFile?.name;
        const fileRef = storageRef.child(name);
        await fileRef.put(currentFile).then(async () => {

            await fileRef.getDownloadURL().then((url) => {
                fullUrl = url
            })
        })
        // await fetch("http://127.0.0.1:3000/post_photo_to_gallery", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "authorization": JSON.stringify(user),
        //     },
        //     body: JSON.stringify({name: name, title: titleValue, fullUrl: fullUrl})
        // })
        const postData = {
            name: name,
            title: titleValue,
            fullUrl: fullUrl
          };
          
          await axios.post("http://127.0.0.1:3000/post_photo_to_gallery", postData, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then((response) => {
            // Przetwarzanie odpowiedzi
            // response.data zawiera dane odpowiedzi
          })
          .catch((error) => {
            // Obsługa błędów
            console.error("Wystąpił błąd:", error);
          });
        setAddingMenu(false)
        setTitleValue("")
        getPhotos()
        setCurrentFile(null);
    }

    return (
        <>
            <button style={{ display: 'inline-block', margin: 0, padding: 0 }} onClick={() => {setAddingMenu(!addingMenu)}}>
                {addingMenu ? "Nie dodawaj zdjęcia" : "Dodaj zdjęcie"}
            </button>
            {addingMenu && <div>
                <input type='file' onChange={handleProfileImageChange}/>
                <input type='text' placeholder='Tytuł' value={titleValue} className='title' onChange={handleTitleChange}/>
                <button className='butt' onClick={sendPhoto}>Dodaj</button>
            </div>}
        </>
    )
}

export default AddPhotoToProfileGallery
