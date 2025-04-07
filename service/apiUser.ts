import { supabase } from "./supabase";

interface userData{
    email:string;
    password:string
}

export const addUser = async (mydata:userData) => {
    let { email, password } = mydata;

    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        console.log("User is not crated");
    }
    return data
};


export const enterUser = async (mydata:userData) => {
    let { email, password } = mydata;

    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        console.log("User is not allowed to enter");
    }

    return data
};


export const gettingUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}


