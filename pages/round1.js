import React, { useState } from 'react';
import { toast } from 'react-toastify';

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); 
  };

  const handleUpload = async (event) => {
    event.preventDefault(); 

    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); 
    formData.set("userId",null )
    formData.set("projectId",null )

    try {
      const response = await fetch('/api/round1/upload', {
        method: 'POST',
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        const data = await response.json();
        // alert('File uploaded successfully.');
        toast.message(data.message)
        console.log(data); // Or handle the response data as needed
      } else {
        toast.error(data.message)
        // alert('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <form onSubmit={handleUpload} encType="multipart/form-data">
      <input type="file" name="file" onChange={handleFileChange} />
      <button type="submit">Upload File</button>
    </form>
  );
}

export default FileUpload;
