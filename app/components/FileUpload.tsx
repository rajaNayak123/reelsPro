"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";


interface IFileUploadProps{
    onSuccess:(res:IKUploadResponse) => void;
    onProgress?:(Progress:number) => void;
    fileType?: "image" | "video"
}

export default function FileUpload({onSuccess,onProgress,fileType}:IFileUploadProps) {

    const [uploading,setUploading] = useState(false)
    const [error, setError] = useState<String|null>(null)

    const onError = (err:{message:string}) => {
        console.log("Error", err);
        setError(err.message)
        setUploading(false)
    };
      
    const handelSuccess = (res:IKUploadResponse) => {
        console.log("Success", res);
        setUploading(false)
        setError(null)
        onSuccess(res)
    };
      
    const handelProgress = (evt:ProgressEvent) => {
        if(evt.lengthComputable && onProgress){
            const percentComplete = (evt.loaded/evt.total)*100
            onProgress(Math.round(percentComplete))
        }
    };
      
    const handelStartUpload = () => {
        setUploading(true)
        setError(null)
    };

    const validateFile = (file:File) =>{
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("Please upload a video file")
                return false
            }
            if(file.size>100 * 1024 * 1024){
                setError("Video file must be less than 100")
                return false
            }
        }else{
            const validTypeImg = ["image/png", "image/jpeg", "image/webp"]
            if(!validTypeImg.includes(file.type)){
                setError("Please upload a valid type image(png, jpeg, webp)")
                return false
            }
            if(file.size>15 * 1024 * 1024){
                setError("Image must be less than 15MB")
                return false
            }
        }
        return false
    }
  return (
    <div className="space-y-3">
        <IKUpload
          className="file-input file-input-bordered w-full"
          fileName={fileType === "video"? "video" : "image"}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handelSuccess}
          onUploadProgress={handelProgress}
          onUploadStart={handelStartUpload}
          folder={fileType === "video"? "/videos" : "/images"}
          accept={fileType === "video"? "video/*" : "image/*"}
          useUniqueFileName={true}
        />
        {
            uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4"/>
                    <span>Loading ...</span>
                </div>
            )
        }
        {
            error && (
                <div className="text-error text-sm">
                    {error}
                </div>
            )
        }
    </div>
  );
}
