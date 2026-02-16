import shutil
import os
from uuid import UUID
from fastapi import UploadFile
from app.core.config import settings

class StorageService:
    def __init__(self):
        # In a real app, logic to switch between S3 and Local based on config
        self.upload_dir = "storage/recordings"
        os.makedirs(self.upload_dir, exist_ok=True)

    async def upload_file(self, file: UploadFile, room_id: UUID) -> dict:
        # Create a safe filename
        file_ext = file.filename.split(".")[-1]
        safe_filename = f"{room_id}_{file.filename}"
        file_path = os.path.join(self.upload_dir, safe_filename)
        
        # Save locally
        # Note: For large files, chunked upload is better. 
        # using shutil.copyfileobj for simplicity in this demo step.
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_size = os.path.getsize(file_path)
        
        return {
            "filename": safe_filename,
            "path": file_path,
            "url": f"/static/recordings/{safe_filename}", # Assuming we mount static
            "size": file_size
        }
