/* eslint-disable prettier/prettier */

import axios from 'axios';
/* eslint-disable prettier/prettier */
const dateToMilliseconds = (dateString) => {
    const date = new Date(dateString);
    const milliseconds = date.getTime();
    return milliseconds;
  };
export const fetchSteps = async (accessToken) => {
  console.log(accessToken);
  try {
    const requestBody = {
      aggregateBy: [
        {
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId:
            'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        },
      ],
      bucketByTime: {
        durationMillis: 86400000,
      },
      startTimeMillis: dateToMilliseconds(new Date(Date.now() - 86400000 * 3)),
      endTimeMillis: dateToMilliseconds(new Date().toISOString()),
    };

    const response = await axios.post(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      console.log(JSON.stringify(response.data));
      return response.data;
    } else {
      console.error(response);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};