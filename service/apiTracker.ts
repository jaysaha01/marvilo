import { error } from "console";
import { supabase } from "./supabase";

interface catagorytype {
  namecategory: string;
  typecategory: string;
  mydate: string
}

interface transactiontype {
  ttype: string;
  note: string;
  amount: number;
  mycategory: string;
  mydate: Date | string;
}

interface budgetype {
  amount: number;
  mycategory: string;
  mydate: Date;
}


interface totalBugetype {
  budgetAmount: number;
  category: string;
  isOverBudget: boolean;
  month: string;
  percentage: string;
  remaining: number;
  spentAmount: number;
}


export const addCategory = async (mydata: catagorytype, cuid: string) => {
  try {
    const { namecategory, mydate } = mydata;

    const { data: categorydb, error } = await supabase
      .from("categories")
      .insert([
        {
          user_id: cuid,
          name: namecategory,
          created_at: mydate || new Date(Date.now()).toISOString(), // Using Date.now()
        },
      ])
      .select(); // Fetch inserted data

    if (error) {
      console.error("Error inserting category:", error);
    } else {
      console.log("Category inserted successfully:", categorydb);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};


export const rendermyCatagory = async () => {
  let { data: catgorydb, error } = await supabase
    .from("categories")
    .select("*");

  if (error) {
    console.log("List is not rendering", error);
  } else {
    // console.log("List Render Successfully", catgorydb);
  }
  return catgorydb;
};

export const deletemyCatagory = async (tid: string, uname: string) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq("id", tid)
      .eq("user_id", uname);
    return error
  } catch (err) {
    console.log(err)
  }
};


export const editCatagory = async (data: any, user_id: string, category_id: string) => {
  const { error } = await supabase
    .from("categories")
    .update({
      name: data.namecategory,
      created_at: data.mydate, 
    })
    .eq("id", category_id) 
    .eq("user_id", user_id) 
    .select(); 

  if (error) throw error;
  return { success: true, message: "Transaction updated successfully!" };
};


export const renderMyTransactions = async () => {
  let { data: tracking, error } = await supabase.from("tracking").select("*");

  if (error) {
    console.log("Tracking Recoard Not Fetch", error);
  } else {
    console.log("Tracking Recoard Fetched Successfully", tracking);
  }

  return tracking;
};

export const addTransations = async (mydata: transactiontype, cuid: string) => {
  let { ttype, note, amount, mycategory, mydate } = mydata;

  try {
    const { data, error } = await supabase
      .from("tracking")
      .insert([
        {
          user_id: cuid,
          type: ttype,
          note: note,
          amount: amount,
          categary: mycategory,
          created_at: mydate,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.log("Unexpected Error in addTransations:", err);
    return null;
  }
};

export const deleteTransations = async (tid: string, uname: string) => {
  try {
    const { error } = await supabase
      .from("tracking")
      .delete()
      .eq("id", tid)
      .eq("user_id", uname);
  } catch (err) {
    console.log(err)
  }
};


export const editTransaction = async (data: any, user_id: string, transaction_id: string) => {
  const { error } = await supabase
    .from("tracking")
    .update({
      type: data.ttype,
      note: data.note,
      amount: data.amount,
      categary: data.mycategory,
      created_at: data.mydate, // Ensure correct date format
    })
    .eq("id", transaction_id) // Match transaction
    .eq("user_id", user_id) // Ensure user-specific update
    .select(); // Return updated record

  if (error) throw error;
  return { success: true, message: "Transaction updated successfully!" };
};


export const addBudgett = async (mydata: budgetype, cuid: string) => {
  let { amount, mycategory, mydate } = mydata;

  try {
    const { data, error } = await supabase
      .from("budget")
      .insert([
        {
          user_id: cuid,
          created_at: mydate,
          amount: amount,
          category: mycategory,
        },
      ]);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export const renderbudget = async () => {

  let { data: budget, error } = await supabase
    .from('budget')
    .select('*')

  if (error) {
    console.log("List is not rendering", error);
  } else {
    console.log("List Render Successfully", budget);
  }
  return budget;

};


export const deletebudget = async (cname: string, date: string, uname: string) => {
  const { error } = await supabase
    .from('budget')
    .delete()
    .eq('category', cname)
    .eq('user_id', uname)
    .eq('created_at', date); 

  if (error) {
    console.error("Error deleting budget:", error);
  }
};


export const addBudgetAnlysis = async (mydata: totalBugetype, cuid: string) => {
  let { budgetAmount, category, isOverBudget, month, percentage, remaining, spentAmount } = mydata;
    
  try {
    const { data, error } = await supabase
      .from("budgetanalysis")
      .insert([
        {
          user_id: cuid,
          budgetAmount: budgetAmount,
          category: category,
          isOverBudget: isOverBudget,
          month: month,
          percentage: percentage,
          remaining: remaining,
          spentAmount: spentAmount
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.log("Unexpected Error in addTransations:", err);
    return null;
  }
};


export const renderBudgetAnalysis = async (mydata: totalBugetype[]) => {
  const { data, error } = await supabase
    .from("budgetanalysis") // Your Supabase table
    .upsert(mydata, { onConflict: "user_id, category, month" }); // Ensure this is a string

  if (error) {
    console.error("🚨 Error updating budget analysis:", error);
  } else {
    console.log("✅ Budget analysis updated successfully:", data);
  }
};

export const forgetPassword = async (email:string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://marvilo.vercel.app/reset-password',
  })
  if(error){
    console.log(error)
  }else{
    console.log(data)
  }
};

export const resetPassword = async (password:string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });
  if(error){
    console.log(error)
  }else{
    console.log(data)
  }
};