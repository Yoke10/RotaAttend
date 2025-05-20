//@ts-nocheck
import axios from 'axios'

const url='https://rotaattend-server.onrender.com';
// const url='http://localhost:5000';

export const createEvents=async(name,starteventDate,endeventDate,categories)=>{
    try {
        const res=await axios.post(`${url}/createevent`,{
            name,
            starteventDate,endeventDate,
            categories
        });
    console.log(res);
    return res.data
    } catch (error) {
         console.log(error);
    }
}
export const getEvents=async()=>{
    try {
        const res=await axios.get(`${url}/getEvents`);
    console.log(res);
    return res.data
    } catch (error) {
         console.log(error);
    }
}
export const getEventid=async(id)=>{
    try {
        const res=await axios.get(`${url}/getid?id=${id}`);
    console.log(res);
    return res.data
    } catch (error) {
         console.log(error);
    }
}
export const SendQr=async(data,x,y,width,height,templateData,nameLayout,clubLayout)=>{
    try {
        const res=await axios.post(`${url}/sendqr`,{
            users:data,
            x,y,width,height,template:templateData,nameLayout,clubLayout
        });
    console.log(res);
    return res
    } catch (error) {
         console.log(error);
    }
}

export const creatMagiccLink=async(data,eventId)=>
{
    try {
        const res=await axios.post(`${url}/create/magiclink`,{
            data,
            eventId
        });
    console.log(res);
    return res
    } catch (error) {
         console.log(error);
    }
}

export const verifyMagiccLink=async(token)=>
    {
        try {
            const res=await axios.post(`${url}/verify/magiclink`,{
                token
            });
        console.log(res);
        return res
        } catch (error) {
             console.log(error);
        }
    }

export const updateUser=async(email,eventId,Category,today)=>
        {
            try {
                const res=await axios.post(`${url}/update/user/event`,{
                    email,
                    eventId,
                    Category,
                    today

                });
            console.log(res);
            return res
            } catch (error) {
                 console.log(error);
            }
        }
export const getEvenUserAnaysis=async(id)=>
            {
                try {
                    const res=await axios.get(`${url}/analysis?eventId=${id}`);
                console.log(res);
                return res.data;
                } catch (error) {
                     console.log(error);
                }
            }
export const handel_Remove_Admin=async(email,id)=>
            {
                try {
                    const res=await axios.post(`${url}/remove/admin`,{
                        email,id
                    });
                console.log(res);
                return res.data;
                } catch (error) {
                     console.log(error);
                }
            }
export const Email_Update=async(from,subject,htmlContent,eventId)=>
            {
                try {
                    const res=await axios.post(`${url}/event/email`,{
                        from,subject,htmlContent,eventId
                    });
                console.log(res);
                return res
                } catch (error) {
                     console.log(error);
                }
            }
export const eventDelete=async(eventId)=>
            {
                try {
                    const res=await axios.post(`${url}/event/delete`,{
                        eventId
                    });
                console.log(res);
                return res
                } catch (error) {
                     console.log(error);
                }
            }
