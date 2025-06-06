import axios from 'axios';

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'grocery-applicaiton');

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dspe0fjlk/image/upload',
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}; 