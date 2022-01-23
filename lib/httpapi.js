import axios from "axios";

export default axios.create({
  baseURL: 'https://hoodwink.medkomtek.net/api',
  headers: {
    //'Origin' : 'hoodwink.medkomtek.net'
    // 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiZWFyZXIiLCJzdWIiOjEyNiwiaWF0IjoxNjQwMTU3Mjg5LCJleHAiOjE2NDAxNjA4ODl9.PynWKOMzIFc1AVObMECMfQ3F8P_DWtBrFilCDLghyyE'
  },
  withCredentials: true
})