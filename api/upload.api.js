const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

export async function getSignature(token) {
  const response = await fetch(`${BACKEND}/upload/signature`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data;
}

export async function uploadPhotoToCloudinary(sign, formData) {
  if (!sign?.cloudName || !sign?.apiKey || !sign?.timestamp || !sign?.signature) {
    throw new Error('INVALID_SIGNATURE');
  }

  const url = `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`;
  formData.append('api_key', sign.apiKey);
  formData.append('timestamp', sign.timestamp);
  formData.append('signature', sign.signature);
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CLOUDINARY_UPLOAD_FAILED:${response.status}:${errorText}`);
  }
  const data = await response.json();
  return data?.secure_url;
}
