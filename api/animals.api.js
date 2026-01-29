const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

export async function postNewReport(report, token) {
  try {
    const response = await fetch(`${BACKEND}/animals/new`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...report }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`POST_REPORT_FAILED:${response.status}:${errorText}`);
    }
    const data = await response.json();
    // report ID or null;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function addPhotoUrlToReport(reportId, photoUrl, token) {
  try {
    const response = await fetch(`${BACKEND}/animals/${reportId}/addPhoto`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoUrl }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ADD_PHOTO_FAILED:${response.status}:${errorText}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}
