import {supabase} from "./supabase.js";
import {notification} from "antd";
import bcrypt from "bcryptjs";

export const getEmpl = async(type,nm)=>{
    let query = supabase.from("member").select("*");
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

export const profileUpload = async (file,isModify) =>{
    console.log("image");
    console.log(file);
    console.log(isModify);
}

export const modifyProfile = async(props) =>{
    console.log("modify");
    console.log(props);
}

export const insertProfile = async(props) =>{
    console.log("insert");
    console.log(props);

    let pw = await bcrypt.hash(props.pw,10);

    let res = await supabase.from("member").insert([
        {
            id:props.id,
            pw,
            nm:props.nm,
            auth:props.auth,
            mail:props.mail,
            entr_date:props.entr_date.format("YYYY-MM-DD"),
            tel:props.tel,
            addr:props.addr,
            account_num:props.account_num,
            bank:props.bank?props.bank:null,
            type:props.type,
        }
        ]);
    console.log(res);
    if(res.error){
        notification.error("에러발생:"+res.error);
    }else{
        notification.success("등록 성공");
    }
    return res;

}