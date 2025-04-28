import {supabase} from "./supabase.js";
import {notification} from "antd";


export const getEmpl = async(type,nm)=>{
    let query = supabase.from("member").select("*");
    console.log(type);
    console.log(nm);
    if(type){
        query = query.eq("type",type);
    }
    if(nm){
        query = query.ilike("nm","%"+nm+"%");
    }
    let res = await query;
    if(res.error){
        notification.error("에러발생:"+res.error);
    }
    console.log(res);
    return res.data;
}