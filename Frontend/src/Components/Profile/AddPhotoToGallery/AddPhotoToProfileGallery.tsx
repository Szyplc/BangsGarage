import { useState, useEffect } from 'react'
import "./AddPhotoToProfileGallery.css"
import { storage } from "../../../base";
import axios, { AxiosError } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../Store/authSlice';
import { Car, loadCarsData } from '../../../Store/carSlice';
import { AppDispatch } from '../../../Store/store';

const AddPhotoToProfileGallery = () => {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector(getUser)
    const car = useSelector(Car)
    const [filePath, setFilePath] = useState<string>(user?.uid + "/" + car?._id || "" + "/")
    const [imageSource, setImageSource] = useState<string>(car?.profileUrl || "")

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if(file) {
              const firebaseUrl = await sendPhotoToFirebase(file)
              sendPhotoToDatabase(file.name, firebaseUrl)
              await deleteOldProfileImage()
              dispatch(loadCarsData())
            }
            setImageSource(URL.createObjectURL(file))
        }
    };

    const deleteOldProfileImage = async () => {
      /*const oldProfileImgId = car?.media.find(media => media.profile === true)?._id
      if(oldProfileImgId)
        await axios.delete("http://127.0.0.1:3000/delete_car_media", { data: { _id: oldProfileImgId, _car_id: car?._id }})*/
      await axios.delete("http://127.0.0.1:3000/delete_car_media", { data: { _car_id: car?._id }})
    }

    const sendPhotoToFirebase = async (currentFile: File): Promise<string> => {
      const storageRef = storage.ref();
      let name = filePath + currentFile.name;
      const fileRef = storageRef.child(name);
      try {
          await fileRef.put(currentFile)
          const url = fileRef.getDownloadURL() as Promise<string>
          return url
      } catch (error) {
          console.error(error)
          return ""
      }
    }

    const sendPhotoToDatabase = async (name: string, fullUrl: string) => {
      const postData = {
        name: name,
        title: name,
        fullUrl: fullUrl,
        profile: true,
        carId: car?._id
      };

      await axios.post("http://127.0.0.1:3000/post_photo_to_gallery", postData, {
        headers: {
          "Content-Type": "application/json",
        }
      })
      .catch((error) => {
        console.error("Wystąpił błąd:", error);
      });

    }

    const isImage = () => { return imageSource != '' && imageSource != "domyślny_url_obrazka" }

    return (
        <>
            { isImage() ? ( <img src={imageSource} width={100} height={100}/> ) : "" }
            <input type='file' onChange={handleProfileImageChange} accept="image/*" />
            {/*<button>{ isImage() ? "Zmień" : "Dodaj" }</button>*/}
        </>
    )
}

export default AddPhotoToProfileGallery
