// import React from 'react'

// function ProductImageUpload() {
//   return (
//     <div>ProductImageUpload</div>
//   )
// }

// export default ProductImageUpload


import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

// OLD CODE:
//   function handleRemoveImage() {
//     setImageFile(null);
//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   }
// NEW CODE:
  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (setUploadedImageUrl) {
      setUploadedImageUrl("");
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    console.log("Cloudinary API CALLED")
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data,
        {
          withCredentials: true,
        }
      );
      console.log(response, "response");

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.secure_url);
      }
    } catch (error) {
      console.error("Upload Error (CORS/Network):", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    console.log("imageFile changed:", imageFile);
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  // console.log("Current imageFile prop is:", imageFile);


  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
{/* // OLD CODE:
//       <div
//         // onDragOver={handleDragOver}
//         // onDrop={handleDrop}
//         className={`${
//           isEditMode ? "opacity-60" : ""
//         } border-2 border-dashed rounded-lg p-4`}
//       >
// NEW CODE: */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 transition-all hover:bg-muted/50`}
      >
{/* // OLD CODE:
//         <Input
//           id="image-upload"
//           type="file"
//           className="hidden"
//           ref={inputRef}
//           onChange={handleImageFileChange}
//           disabled={isEditMode}
//         />
// NEW CODE: */}
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
        />
{/* // OLD CODE:
//         {!imageFile ? (
//           <Label
//             htmlFor="image-upload"
//             className={`${
//               isEditMode ? "cursor-not-allowed" : ""
//             } flex flex-col items-center justify-center h-32 cursor-pointer`}
//           >
//             <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
//             <span>Drag & drop or click to upload image</span>
//           </Label>
//         ) : imageLoadingState ? (
//           <Skeleton className="h-10 bg-gray-400" />
//         ) : (
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <FileIcon className="w-8 text-primary mr-2 h-8" />
//             </div>
//             <p className="text-sm font-medium">{imageFile.name}</p>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-muted-foreground hover:text-foreground"
//               onClick={handleRemoveImage}
//             >
//               <XIcon className="w-4 h-4" />
//               <span className="sr-only">Remove File</span>
//             </Button>
//           </div>
//         )}
// NEW CODE: */}
        {imageLoadingState ? (
          <Skeleton className="h-40 w-full bg-gray-200 rounded-lg" />
        ) : uploadedImageUrl || imageFile ? (
          <div className="relative group rounded-lg overflow-hidden h-48 border bg-muted flex flex-col items-center justify-center">
            <img 
              src={uploadedImageUrl || (imageFile && URL.createObjectURL(imageFile))} 
              alt="Product Preview" 
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
              <Button
                variant="destructive"
                size="icon"
                className="w-10 h-10 rounded-full"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-5 h-5" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
            <div className="flex items-center mt-2">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            
          </div>
        ) : (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer transition-colors hover:bg-muted/50"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;