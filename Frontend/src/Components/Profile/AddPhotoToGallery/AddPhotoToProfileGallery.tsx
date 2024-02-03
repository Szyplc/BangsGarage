import { useState, useContext, useEffect } from 'react'
import "./AddPhotoToProfileGallery.css"
import { storage } from "../../../base";
import { AuthContext } from '../../Auth/AuthContext';
import axios from 'axios';

type AddPhotoToGalleryProps = {
    afterSend: Function | undefined;
    addingMenuProp: boolean;
    filePath: string
    addButton: boolean;
}

const AddPhotoToProfileGallery = ({ afterSend, addingMenuProp, filePath, addButton }: AddPhotoToGalleryProps) => {
    const [addingMenu, setAddingMenu] = useState<boolean>(addingMenuProp)
    const [titleValue, setTitleValue] = useState('')
    const [currentFile, setCurrentFile] = useState<Blob | null>(null)
    const { user } = useContext(AuthContext);

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setCurrentFile(file);
            setTitleValue(file.name)
        }
    };

    useEffect(() => {
        if(currentFile) {
            sendPhoto();
        }
    }, [currentFile])

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitleValue(event.target.value);
    }

    const sendPhoto = async () => {
        if(currentFile == null)
            return;

        let fullUrl = ""
        const storageRef = storage.ref();
        let name = filePath + titleValue;
        console.log(name)
        //let name = user?.uid + "/gallery/" + titleValue;//////////////////////
        const fileRef = storageRef.child(name);
        try {
            await fileRef.put(currentFile)
            const url = await fileRef.getDownloadURL()
            fullUrl = url
        } catch (error) {
            console.error(error)
        }
        
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
          .catch((error) => {
            console.error("Wystąpił błąd:", error);
          });
        setAddingMenu(false)
        setTitleValue("")
        if(typeof afterSend !== "undefined")
            afterSend(name)
        setCurrentFile(null);
    }

    return (
        <>
            <button type='button' style={{ display: 'inline-block', margin: 0, padding: 0 }} onClick={() => {setAddingMenu(!addingMenu)}}>
                {addingMenu ? "Nie dodawaj zdjęcia" : "Dodaj zdjęcie"}
            </button>
            {addingMenu && <div>
                <input type='file' onChange={handleProfileImageChange}/>
                {addButton && <>
                        <input type='text' placeholder='Tytuł' value={titleValue} className='title' onChange={handleTitleChange}/>
                        <button type='button' className='butt' onClick={sendPhoto}>Dodaj</button>
                    </>
                }
            </div>}
        </>
    )
}

export default AddPhotoToProfileGallery
