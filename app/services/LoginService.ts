import axios from "../../lib/axiosUtil";

const GetTokenForCompanyId = (companyId: number) => {
    console.log('company', companyId)
  var respponse = axios.get("Public/GetToken?companyId=" + companyId);
  console.log("url", axios.getUri())
  return respponse
}
export default {
  GetTokenForCompanyId
};