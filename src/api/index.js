import axios from "axios";

export const reqMeterial = () => axios({
    method: "get",
    url: "https://danxiagis.top:8081/uploadData/get",
})

export const reqGetDDL = () => axios({
    method: 'get',
    url: 'https://danxiagis.top:8081/teacher/getFileDDL'
})

export const reqGetGroupAssess = (gourp_id) => axios({
    method: "get",
    url: "https://danxiagis.top:8081/teacher/getOneGroupAssess", //http://localhost:8088/teacher/getOneGroupAssess
    params: {
        group_id:gourp_id
    },
})
/* 获得考核问题 */
export const reqGetAllAssessment=()=>axios({
    url:'https://danxiagis.top:8081/assessment/getAllAssessment',
    method:'get'
})
/* 获得做大状态 */
export const reqGetAllAnswer=()=>axios({
        url:'https://danxiagis.top:8081/assessment/getAllGroupAssessment',
        method:'get'
})

export const reqGetAllThought=()=>axios({
    url:'https://danxiagis.top:8081/assessment/getAllGroupThought',
    method:'get'
})

export const reqGetConfig=()=>axios({
    method: "get",
    url: "https://danxiagis.top:8081/teacher/getConfiguration", //http://danxiagis.top:3000/ui/teacher/getConfiguration
  })