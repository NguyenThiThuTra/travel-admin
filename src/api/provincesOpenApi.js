import axios from 'axios';
const baseURL = 'https://provinces.open-api.vn/api';
const provincesOpenApi = {
  async getAllProvinces() {
    const url = `${baseURL}/p`;
    let data = null;
    try {
      const res = await axios.get(url);
      data = await res.data;
    } catch (e) {
      data = e;
    }
    return data;
  },
  async getDistricts(provinceCode) {
    const url = `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`;
    const res = await axios.get(url);
    const data = await res.data;
    return data;
  },
  async getWards(districtCode) {
    const url = `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`;
    const res = await axios.get(url);
    const data =await res.data;
    return data;
  },
};
export default provincesOpenApi;
